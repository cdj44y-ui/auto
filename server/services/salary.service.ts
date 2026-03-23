/**
 * P-04: 급여 계산 엔진 (서버)
 * 4대보험 + 소득세 원천징수 + 실수령액 계산
 * 
 * 법적 근거:
 * - 국민연금법 제88조 (기준소득월액)
 * - 국민건강보험법 제69조 (보험료율)
 * - 노인장기요양보험법 제8조 (장기요양보험료율)
 * - 고용보험법 제76조 (실업급여 보험료율)
 * - 소득세법 시행령 별표2 (간이세액표)
 */

import { lookupSimplifiedTax } from "./tax-table";

// ============ 2026년 4대보험 요율 ============

/** 국민연금: 기준소득월액 상한 617만원, 하한 39만원, 요율 4.5% (근로자 부담분) */
const NP_RATE = 0.045;
const NP_UPPER_LIMIT = 6_170_000; // 기준소득월액 상한
const NP_LOWER_LIMIT = 390_000;   // 기준소득월액 하한

/** 건강보험: 요율 3.545% (근로자 부담분) */
const HI_RATE = 0.03545;

/** 장기요양보험: 건강보험료의 12.81% */
const LTC_RATE = 0.1281;

/** 고용보험: 실업급여 0.9% (근로자 부담분) */
const EI_RATE = 0.009;

// ============ Types ============

export interface InsuranceResult {
  nationalPension: number;    // 국민연금
  healthInsurance: number;    // 건강보험
  longTermCare: number;       // 장기요양보험
  employmentInsurance: number; // 고용보험
  total: number;
}

export interface TaxResult {
  incomeTax: number;          // 소득세
  localIncomeTax: number;     // 지방소득세 (소득세의 10%)
  total: number;
}

export interface NetPayResult {
  grossPay: number;
  insurance: InsuranceResult;
  tax: TaxResult;
  totalDeductions: number;
  netPay: number;
}

// ============ 4대보험 계산 ============

/**
 * 4대보험 공제액 계산
 * @param monthlySalary 월 보수월액 (비과세 제외)
 * @returns InsuranceResult
 */
export function calculateInsurance(monthlySalary: number): InsuranceResult {
  // 국민연금: 기준소득월액 상·하한 적용, 원 미만 절사
  // 국민연금법 시행령 제5조
  const npBase = Math.min(NP_UPPER_LIMIT, Math.max(NP_LOWER_LIMIT, monthlySalary));
  const nationalPension = Math.floor(npBase * NP_RATE);

  // 건강보험: 보수월액 × 3.545%, 원 미만 절사
  const healthInsurance = Math.floor(monthlySalary * HI_RATE);

  // 장기요양보험: 건강보험료 × 12.81%, 원 미만 절사
  const longTermCare = Math.floor(healthInsurance * LTC_RATE);

  // 고용보험: 월 보수 × 0.9%, 원 미만 절사
  const employmentInsurance = Math.floor(monthlySalary * EI_RATE);

  const total = nationalPension + healthInsurance + longTermCare + employmentInsurance;

  return { nationalPension, healthInsurance, longTermCare, employmentInsurance, total };
}

// ============ 소득세 계산 ============

/**
 * 소득세 + 지방소득세 계산
 * @param monthlySalary 월 급여 (과세 대상)
 * @param dependents 부양가족 수 (본인 포함, 최소 1)
 * @returns TaxResult
 */
export function calculateIncomeTax(monthlySalary: number, dependents: number): TaxResult {
  // 간이세액표 기반 소득세 조회
  const incomeTax = lookupSimplifiedTax(monthlySalary, dependents);

  // 지방소득세: 소득세의 10% (지방세법 제92조)
  const localIncomeTax = Math.floor(incomeTax * 0.1);

  return {
    incomeTax,
    localIncomeTax,
    total: incomeTax + localIncomeTax,
  };
}

// ============ 실수령액 계산 ============

/**
 * 실수령액 종합 계산
 * @param input 기본급, 연장수당, 상여, 수당, 부양가족 수
 * @returns NetPayResult
 */
export function calculateNetPay(input: {
  baseSalary: number;
  overtimePay: number;
  bonus: number;
  allowances: number;
  dependents: number;
}): NetPayResult {
  const grossPay = input.baseSalary + input.overtimePay + input.bonus + input.allowances;

  // 4대보험은 총 보수 기준 (비과세 수당 제외해야 하나, 여기서는 전체 적용)
  const insurance = calculateInsurance(grossPay);

  // 소득세는 과세 대상 급여 기준
  const tax = calculateIncomeTax(grossPay, input.dependents || 1);

  const totalDeductions = insurance.total + tax.total;
  const netPay = grossPay - totalDeductions;

  return {
    grossPay,
    insurance,
    tax,
    totalDeductions,
    netPay: Math.max(0, netPay),
  };
}
