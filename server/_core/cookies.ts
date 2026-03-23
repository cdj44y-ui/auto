import type { CookieOptions, Request } from "express";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function isIpAddress(host: string) {
  // Basic IPv4 check and IPv6 presence detection.
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true;
  return host.includes(":");
}

function isSecureRequest(req: Request) {
  if (req.protocol === "https") return true;

  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;

  const protoList = Array.isArray(forwardedProto)
    ? forwardedProto
    : forwardedProto.split(",");

  return protoList.some(proto => proto.trim().toLowerCase() === "https");
}

/**
 * P-02-SEC: 쿠키 보안 강화
 * - HTTP에서는 SameSite=lax (CSRF 방어)
 * - HTTPS에서는 SameSite=none + Secure (크로스 도메인 허용)
 * - maxAge: 8시간 (세션 타임아웃)
 */
export function getSessionCookieOptions(
  req: Request
): Pick<CookieOptions, "domain" | "httpOnly" | "path" | "sameSite" | "secure" | "maxAge"> {
  const secure = isSecureRequest(req);

  return {
    httpOnly: true,
    path: "/",
    sameSite: secure ? "none" : "lax",  // HTTP에서는 lax (CSRF 방어)
    secure,
    maxAge: 8 * 60 * 60 * 1000, // 8시간
  };
}
