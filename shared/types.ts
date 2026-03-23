/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export type * from "../drizzle/schema";
export * from "./_core/errors";

/**
 * P-01: 6단계 권한 체계 — DB enum과 일치
 * super_admin(100) > consultant(80) > company_admin(60) > company_hr(40) > company_finance(30) > employee(10)
 */
export type AppUserRole = "super_admin" | "consultant" | "company_admin" | "company_hr" | "company_finance" | "employee";

export const ROLE_HIERARCHY: Record<string, number> = {
  super_admin: 100,
  consultant: 80,
  company_admin: 60,
  company_hr: 40,
  company_finance: 30,
  employee: 10,
} as const;

/** 주어진 역할이 최소 요구 역할 이상인지 확인 */
export function hasMinRole(userRole: string, minRole: string): boolean {
  return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[minRole] ?? 999);
}
