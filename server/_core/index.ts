import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { ENV } from "./env";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // ── Trust proxy for production (behind reverse proxy / load balancer) ──
  app.set('trust proxy', 1);

  // ── P-02-SEC: Helmet 보안 헤더 ──
  app.use(helmet({
    contentSecurityPolicy: ENV.isProduction ? undefined : false,
  }));

  // ── P-02-SEC: CORS 설정 ──
  // Express 내장 CORS 미들웨어 대신 수동 설정 (의존성 최소화)
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    // 개발 모드: 모든 오리진 허용, 프로덕션: 동일 오리진만
    if (!ENV.isProduction || !origin) {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
    } else {
      // 프로덕션에서는 동일 오리진이므로 별도 CORS 불필요
      // 필요 시 process.env.CLIENT_URL 기반으로 허용
      const allowedOrigin = process.env.CLIENT_URL || origin;
      res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });

  // ── P-02-SEC: Rate Limiting ──
  // 전역: 100 req / 15분
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
  });
  app.use('/api/', globalLimiter);

  // 로그인 전용: 5 req / 15분
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: '로그인 시도가 너무 많습니다. 15분 후 다시 시도해주세요.' },
  });
  app.use('/api/oauth/', authLimiter);

  // Body parser
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // P-08: SSE endpoint for real-time notifications
  app.get("/api/sse", async (req, res) => {
    try {
      const { sdk } = await import("./sdk");
      const user = await sdk.authenticateRequest(req);
      if (!user) { res.status(401).end(); return; }

      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      });
      res.write("data: {\"type\":\"connected\"}\n\n");

      const { addConnection } = await import("../services/sse.service");
      addConnection(user.id, res);
    } catch {
      res.status(401).end();
    }
  });

  // P-03: Health check endpoint
  app.get("/api/health", async (_req, res) => {
    try {
      const { checkDbHealth } = await import("../db");
      const dbHealth = await checkDbHealth();
      const { getConnectionCount } = await import("../services/sse.service");
      res.json({
        status: dbHealth.connected ? "healthy" : "degraded",
        uptime: process.uptime(),
        db: dbHealth,
        sse: { connections: getConnectionCount() },
        timestamp: Date.now(),
      });
    } catch (e) {
      res.status(500).json({ status: "error", error: String(e) });
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
