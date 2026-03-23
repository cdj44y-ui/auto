import { describe, it, expect } from "vitest";
import { ROLE_HIERARCHY, UserRole } from "../shared/types";

describe("P-01: 6단계 권한 체계 (ROLE_HIERARCHY)", () => {
  it("should define exactly 6 roles", () => {
    const roles = Object.keys(ROLE_HIERARCHY);
    expect(roles).toHaveLength(6);
  });

  it("should have correct hierarchy order", () => {
    expect(ROLE_HIERARCHY.super_admin).toBeGreaterThan(ROLE_HIERARCHY.consultant);
    expect(ROLE_HIERARCHY.consultant).toBeGreaterThan(ROLE_HIERARCHY.company_admin);
    expect(ROLE_HIERARCHY.company_admin).toBeGreaterThan(ROLE_HIERARCHY.company_hr);
    expect(ROLE_HIERARCHY.company_hr).toBeGreaterThan(ROLE_HIERARCHY.company_finance);
    expect(ROLE_HIERARCHY.company_finance).toBeGreaterThan(ROLE_HIERARCHY.employee);
  });

  it("super_admin should have highest level (100)", () => {
    expect(ROLE_HIERARCHY.super_admin).toBe(100);
  });

  it("employee should have lowest level (10)", () => {
    expect(ROLE_HIERARCHY.employee).toBe(10);
  });

  it("hasMinRole helper logic should work correctly", () => {
    // Simulate hasMinRole check
    const hasMinRole = (userRole: UserRole, minRole: UserRole): boolean => {
      return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[minRole] ?? 0);
    };

    expect(hasMinRole("super_admin", "employee")).toBe(true);
    expect(hasMinRole("super_admin", "super_admin")).toBe(true);
    expect(hasMinRole("employee", "super_admin")).toBe(false);
    expect(hasMinRole("consultant", "company_admin")).toBe(true);
    expect(hasMinRole("company_hr", "company_admin")).toBe(false);
    expect(hasMinRole("company_finance", "company_hr")).toBe(false);
  });
});

describe("P-01: UserRole type validation", () => {
  it("should include all 6 expected roles", () => {
    const expectedRoles: UserRole[] = [
      "super_admin",
      "consultant",
      "company_admin",
      "company_hr",
      "company_finance",
      "employee",
    ];
    
    for (const role of expectedRoles) {
      expect(ROLE_HIERARCHY[role]).toBeDefined();
      expect(typeof ROLE_HIERARCHY[role]).toBe("number");
    }
  });
});
