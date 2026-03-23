import { describe, expect, it, vi, beforeEach } from "vitest";

/**
 * P-01/P-02: RBAC + Tenant Isolation 테스트
 * DB 호출을 모킹하여 미들웨어 로직만 검증
 */

// Mock db module before importing routers
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({}),
  getAllEmployees: vi.fn().mockResolvedValue([
    { id: 1, name: "테스트직원", department: "개발팀", clientId: 1 },
  ]),
  getPayrollByPeriod: vi.fn().mockResolvedValue([
    { id: 1, employeeId: 1, period: "202601", baseSalary: 3000000 },
  ]),
  getPayrollByEmployee: vi.fn().mockResolvedValue([]),
  getEmployeeById: vi.fn().mockResolvedValue(null),
  createEmployee: vi.fn().mockResolvedValue(1),
  updateEmployee: vi.fn().mockResolvedValue(undefined),
  deleteEmployee: vi.fn().mockResolvedValue(undefined),
  createEmployeesBulk: vi.fn().mockResolvedValue(0),
  checkDbHealth: vi.fn().mockResolvedValue({ connected: true }),
  getClientHealthScores: vi.fn().mockResolvedValue([]),
  getAuditLogs: vi.fn().mockResolvedValue([]),
  createPayrollRecord: vi.fn().mockResolvedValue(1),
  getNotifications: vi.fn().mockResolvedValue([]),
  getAllClients: vi.fn().mockResolvedValue([]),
  getAllConsultations: vi.fn().mockResolvedValue([]),
}));

// Mock audit log
vi.mock("./middleware/audit", () => ({
  writeAuditLog: vi.fn().mockResolvedValue(undefined),
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockContext(
  role: 'super_admin' | 'consultant' | 'company_admin' | 'company_hr' | 'company_finance' | 'employee',
  clientId?: number | null
): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    department: "테스트팀",
    clientId: clientId ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
      ip: "127.0.0.1",
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

describe("Employee RBAC (P-01: 6단계 권한)", () => {
  it("allows super_admin to access employee.list", async () => {
    const ctx = createMockContext("super_admin");
    const caller = appRouter.createCaller(ctx);
    await expect(caller.employee.list()).resolves.toBeDefined();
  });

  it("allows company_hr with clientId to access employee.list", async () => {
    const ctx = createMockContext("company_hr", 1);
    const caller = appRouter.createCaller(ctx);
    await expect(caller.employee.list()).resolves.toBeDefined();
  });

  it("denies company_finance from accessing employee.list", async () => {
    const ctx = createMockContext("company_finance", 1);
    const caller = appRouter.createCaller(ctx);
    await expect(caller.employee.list()).rejects.toThrow();
  });

  it("denies employee from accessing employee.list", async () => {
    const ctx = createMockContext("employee", 1);
    const caller = appRouter.createCaller(ctx);
    await expect(caller.employee.list()).rejects.toThrow();
  });

  it("denies unauthenticated user from accessing employee.list", async () => {
    const ctx = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.employee.list()).rejects.toThrow();
  });
});

describe("Payroll RBAC (P-01: 6단계 권한)", () => {
  it("allows super_admin to access payroll.getByPeriod", async () => {
    const ctx = createMockContext("super_admin");
    const caller = appRouter.createCaller(ctx);
    await expect(caller.payroll.getByPeriod({ period: "202601" })).resolves.toBeDefined();
  });

  it("allows company_finance with clientId to access payroll.getByPeriod", async () => {
    const ctx = createMockContext("company_finance", 1);
    const caller = appRouter.createCaller(ctx);
    await expect(caller.payroll.getByPeriod({ period: "202601" })).resolves.toBeDefined();
  });

  it("allows company_hr to access payroll.getByPeriod (hr level > finance level)", async () => {
    // company_hr(40) > company_finance(30) in hierarchy, so hr CAN access finance routes
    const ctx = createMockContext("company_hr", 1);
    const caller = appRouter.createCaller(ctx);
    await expect(caller.payroll.getByPeriod({ period: "202601" })).resolves.toBeDefined();
  });

  it("denies employee from accessing payroll.getByPeriod", async () => {
    const ctx = createMockContext("employee", 1);
    const caller = appRouter.createCaller(ctx);
    await expect(caller.payroll.getByPeriod({ period: "202601" })).rejects.toThrow();
  });
});

describe("Tenant Isolation (P-02)", () => {
  it("rejects company_hr without clientId", async () => {
    const ctx = createMockContext("company_hr");
    const caller = appRouter.createCaller(ctx);
    await expect(caller.employee.list()).rejects.toThrow("소속 고객사가 지정되지 않았습니다");
  });

  it("super_admin bypasses tenant check (no clientId needed)", async () => {
    const ctx = createMockContext("super_admin");
    const caller = appRouter.createCaller(ctx);
    await expect(caller.employee.list()).resolves.toBeDefined();
  });

  it("consultant bypasses tenant check (no clientId needed)", async () => {
    const ctx = createMockContext("consultant");
    const caller = appRouter.createCaller(ctx);
    // consultant has level 80, hrProcedure requires level >= 40 (company_hr)
    // consultant(80) >= company_hr(40) → passes
    await expect(caller.employee.list()).resolves.toBeDefined();
  });
});
