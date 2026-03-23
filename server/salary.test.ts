/**
 * P-04: 급여 계산 엔진 단위 테스트
 * - 4대보험 요율 검증
 * - 소득세 계산 검증
 * - 원 미만 절사 검증
 */
import { describe, it, expect } from "vitest";
import { calculateNetPay } from "./services/salary.service";

describe("P-04: 급여 계산 엔진 (salary.service)", () => {
  it("기본 급여 300만원, 부양가족 1인 계산", () => {
    const result = calculateNetPay({
      baseSalary: 3_000_000,
      overtimePay: 0,
      bonus: 0,
      allowances: 0,
      dependents: 1,
    });

    expect(result.grossPay).toBe(3_000_000);
    expect(result.netPay).toBeGreaterThan(0);
    expect(result.netPay).toBeLessThan(3_000_000);

    // 4대보험 검증 (2026년 요율)
    // 국민연금: 4.5% (상한 590만원)
    expect(result.insurance.nationalPension).toBe(Math.floor(3_000_000 * 0.045));
    // 건강보험: 3.545%
    expect(result.insurance.healthInsurance).toBe(Math.floor(3_000_000 * 0.03545));
    // 장기요양: 건강보험의 12.81%
    expect(result.insurance.longTermCare).toBe(Math.floor(result.insurance.healthInsurance * 0.1281));
    // 고용보험: 0.9%
    expect(result.insurance.employmentInsurance).toBe(Math.floor(3_000_000 * 0.009));

    // 총 공제액 = 4대보험 + 소득세 + 지방소득세
    const totalInsurance = result.insurance.nationalPension + result.insurance.healthInsurance
      + result.insurance.longTermCare + result.insurance.employmentInsurance;
    const totalTax = result.tax.incomeTax + result.tax.localIncomeTax;
    expect(result.totalDeductions).toBe(totalInsurance + totalTax);
    expect(result.netPay).toBe(result.grossPay - result.totalDeductions);
  });

  it("국민연금 상한액 적용 (월 590만원 초과)", () => {
    const result = calculateNetPay({
      baseSalary: 7_000_000,
      overtimePay: 0,
      bonus: 0,
      allowances: 0,
      dependents: 1,
    });

    // 국민연금 상한: 6,170,000 * 4.5% = 277,650
    expect(result.insurance.nationalPension).toBe(Math.floor(6_170_000 * 0.045));
  });

  it("국민연금 하한액 적용 (월 39만원 미만)", () => {
    const result = calculateNetPay({
      baseSalary: 300_000,
      overtimePay: 0,
      bonus: 0,
      allowances: 0,
      dependents: 1,
    });

    // 국민연금 하한: 390,000 * 4.5% = 17,550
    expect(result.insurance.nationalPension).toBe(Math.floor(390_000 * 0.045));
  });

  it("지방소득세 = 소득세의 10%", () => {
    const result = calculateNetPay({
      baseSalary: 5_000_000,
      overtimePay: 500_000,
      bonus: 0,
      allowances: 0,
      dependents: 2,
    });

    expect(result.tax.localIncomeTax).toBe(Math.floor(result.tax.incomeTax * 0.1));
  });

  it("수당 포함 총 지급액 계산", () => {
    const result = calculateNetPay({
      baseSalary: 3_000_000,
      overtimePay: 500_000,
      bonus: 200_000,
      allowances: 100_000,
      dependents: 1,
    });

    expect(result.grossPay).toBe(3_800_000);
  });

  it("모든 금액은 원 미만 절사 (정수)", () => {
    const result = calculateNetPay({
      baseSalary: 3_333_333,
      overtimePay: 0,
      bonus: 0,
      allowances: 0,
      dependents: 1,
    });

    expect(Number.isInteger(result.insurance.nationalPension)).toBe(true);
    expect(Number.isInteger(result.insurance.healthInsurance)).toBe(true);
    expect(Number.isInteger(result.insurance.longTermCare)).toBe(true);
    expect(Number.isInteger(result.insurance.employmentInsurance)).toBe(true);
    expect(Number.isInteger(result.tax.incomeTax)).toBe(true);
    expect(Number.isInteger(result.tax.localIncomeTax)).toBe(true);
    expect(Number.isInteger(result.netPay)).toBe(true);
  });
});
