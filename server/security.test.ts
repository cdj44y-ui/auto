import { describe, it, expect } from "vitest";

/**
 * P-02-SEC: 보안 미들웨어 단위 테스트
 * Express 미들웨어는 통합 테스트 대상이므로, 여기서는 환경변수 검증 로직과
 * 쿠키 옵션 생성 로직을 단위 테스트합니다.
 */

describe("ENV validation (P-01-SEC)", () => {
  it("ENV module exports required fields", async () => {
    // ENV는 이미 서버 시작 시 검증됨. 여기서는 모듈 구조만 확인
    const { ENV } = await import("./_core/env");
    expect(ENV).toHaveProperty("appId");
    expect(ENV).toHaveProperty("cookieSecret");
    expect(ENV).toHaveProperty("databaseUrl");
    expect(ENV).toHaveProperty("oAuthServerUrl");
    expect(ENV).toHaveProperty("isProduction");
    expect(typeof ENV.isProduction).toBe("boolean");
  });

  it("JWT_SECRET exists and is a string", async () => {
    const { ENV } = await import("./_core/env");
    expect(typeof ENV.cookieSecret).toBe("string");
    expect(ENV.cookieSecret.length).toBeGreaterThan(0);
  });
});

describe("Cookie options (P-02-SEC)", () => {
  it("returns httpOnly and path correctly", async () => {
    const { getSessionCookieOptions } = await import("./_core/cookies");
    // Mock HTTP request (not HTTPS)
    const mockReq = {
      protocol: "http",
      headers: {},
      hostname: "localhost",
    } as any;

    const opts = getSessionCookieOptions(mockReq);
    expect(opts.httpOnly).toBe(true);
    expect(opts.path).toBe("/");
    expect(opts.sameSite).toBe("lax"); // HTTP → lax
    expect(opts.secure).toBe(false);
    expect(opts.maxAge).toBe(8 * 60 * 60 * 1000); // 8시간
  });

  it("returns secure + sameSite=none for HTTPS", async () => {
    const { getSessionCookieOptions } = await import("./_core/cookies");
    const mockReq = {
      protocol: "https",
      headers: {},
      hostname: "example.com",
    } as any;

    const opts = getSessionCookieOptions(mockReq);
    expect(opts.sameSite).toBe("none");
    expect(opts.secure).toBe(true);
    expect(opts.maxAge).toBe(8 * 60 * 60 * 1000);
  });

  it("detects HTTPS from x-forwarded-proto header", async () => {
    const { getSessionCookieOptions } = await import("./_core/cookies");
    const mockReq = {
      protocol: "http",
      headers: { "x-forwarded-proto": "https" },
      hostname: "example.com",
    } as any;

    const opts = getSessionCookieOptions(mockReq);
    expect(opts.sameSite).toBe("none");
    expect(opts.secure).toBe(true);
  });
});

describe("Tenant isolation (P-01/P-02)", () => {
  it("ROLE_HIERARCHY has correct 6-level values", async () => {
    const { ROLE_HIERARCHY } = await import("@shared/types");
    expect(ROLE_HIERARCHY.super_admin).toBe(100);
    expect(ROLE_HIERARCHY.consultant).toBe(80);
    expect(ROLE_HIERARCHY.company_admin).toBe(60);
    expect(ROLE_HIERARCHY.company_hr).toBe(40);
    expect(ROLE_HIERARCHY.company_finance).toBe(30);
    expect(ROLE_HIERARCHY.employee).toBe(10);
  });
});
