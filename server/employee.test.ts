import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockContext(role: 'user' | 'admin' | 'hr' | 'finance'): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    department: "테스트팀",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createUnauthenticatedContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Employee RBAC", () => {
  it("allows admin to access employee.list", async () => {
    const ctx = createMockContext("admin");
    const caller = appRouter.createCaller(ctx);
    
    // Should not throw - admin has access
    await expect(caller.employee.list()).resolves.toBeDefined();
  });

  it("allows hr role to access employee.list", async () => {
    const ctx = createMockContext("hr");
    const caller = appRouter.createCaller(ctx);
    
    // Should not throw - hr has access
    await expect(caller.employee.list()).resolves.toBeDefined();
  });

  it("denies finance role from accessing employee.list", async () => {
    const ctx = createMockContext("finance");
    const caller = appRouter.createCaller(ctx);
    
    // Should throw FORBIDDEN error
    await expect(caller.employee.list()).rejects.toThrow("인사 관리 권한이 필요합니다.");
  });

  it("denies regular user from accessing employee.list", async () => {
    const ctx = createMockContext("user");
    const caller = appRouter.createCaller(ctx);
    
    // Should throw FORBIDDEN error
    await expect(caller.employee.list()).rejects.toThrow("인사 관리 권한이 필요합니다.");
  });

  it("denies unauthenticated user from accessing employee.list", async () => {
    const ctx = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);
    
    // Should throw UNAUTHORIZED error
    await expect(caller.employee.list()).rejects.toThrow();
  });
});

describe("Payroll RBAC", () => {
  it("allows admin to access payroll.getByPeriod", async () => {
    const ctx = createMockContext("admin");
    const caller = appRouter.createCaller(ctx);
    
    // Should not throw - admin has access
    await expect(caller.payroll.getByPeriod({ period: "202601" })).resolves.toBeDefined();
  });

  it("allows finance role to access payroll.getByPeriod", async () => {
    const ctx = createMockContext("finance");
    const caller = appRouter.createCaller(ctx);
    
    // Should not throw - finance has access
    await expect(caller.payroll.getByPeriod({ period: "202601" })).resolves.toBeDefined();
  });

  it("denies hr role from accessing payroll.getByPeriod", async () => {
    const ctx = createMockContext("hr");
    const caller = appRouter.createCaller(ctx);
    
    // Should throw FORBIDDEN error
    await expect(caller.payroll.getByPeriod({ period: "202601" })).rejects.toThrow("급여 관리 권한이 필요합니다.");
  });

  it("denies regular user from accessing payroll.getByPeriod", async () => {
    const ctx = createMockContext("user");
    const caller = appRouter.createCaller(ctx);
    
    // Should throw FORBIDDEN error
    await expect(caller.payroll.getByPeriod({ period: "202601" })).rejects.toThrow("급여 관리 권한이 필요합니다.");
  });
});
