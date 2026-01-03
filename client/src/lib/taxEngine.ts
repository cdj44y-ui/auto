/**
 * 2025년/2026년 정부 기준 4대보험 및 소득세 계산 엔진
 * 근거: 국민연금공단, 건강보험공단, 고용노동부, 국세청 고시 자료
 */

// 2025년 4대보험 요율 (근로자 부담분 기준)
export const TAX_RATES_2025 = {
  pension: 0.045, // 국민연금: 4.5%
  health: 0.03545, // 건강보험: 3.545%
  care: 0.1295, // 장기요양: 건강보험료의 12.95% (변동 가능, 2025년 기준)
  employment: 0.009, // 고용보험: 0.9%
};

// 국민연금 상한액/하한액 (2025년 7월 ~ 2026년 6월 기준 예상치)
// 실제로는 매년 7월 변동되므로 업데이트 필요
const PENSION_LIMITS = {
  min: 400000, // 하한액
  max: 6370000, // 상한액
};

// 근로소득 간이세액표 (2024.3.1 개정분 적용, 2026년까지 유효)
// 실제로는 국세청 엑셀 데이터를 파싱하거나 API를 연동해야 하지만,
// 여기서는 핵심 구간에 대한 약식 로직을 구현하여 시뮬레이션합니다.
// (정확한 계산을 위해서는 전체 구간표 데이터베이스가 필요함)
function calculateIncomeTax(monthlyIncome: number, dependents: number = 1): number {
  // 비과세 소득(식대 등)은 이미 제외된 금액이어야 함
  if (monthlyIncome < 1060000) return 0;

  // 약식 계산 로직 (실제 간이세액표의 추세선 반영)
  // 정확한 금액은 국세청 홈택스 모의계산과 100% 일치하지 않을 수 있음
  let tax = 0;
  
  if (monthlyIncome <= 3000000) {
    tax = (monthlyIncome - 1060000) * 0.015; // 저소득 구간
  } else if (monthlyIncome <= 5000000) {
    tax = 29100 + (monthlyIncome - 3000000) * 0.05;
  } else if (monthlyIncome <= 7000000) {
    tax = 129100 + (monthlyIncome - 5000000) * 0.1;
  } else if (monthlyIncome <= 10000000) {
    tax = 329100 + (monthlyIncome - 7000000) * 0.15;
  } else {
    tax = 779100 + (monthlyIncome - 10000000) * 0.25; // 고소득 구간
  }

  // 부양가족 공제 (본인 제외 1인당 약 2만원 세액 공제 효과 시뮬레이션)
  if (dependents > 1) {
    tax -= (dependents - 1) * 20000;
  }

  return Math.max(0, Math.floor(tax / 10) * 10); // 10원 단위 절사
}

export interface TaxResult {
  nationalPension: number; // 국민연금
  healthInsurance: number; // 건강보험
  longTermCare: number; // 장기요양
  employmentInsurance: number; // 고용보험
  incomeTax: number; // 소득세
  localIncomeTax: number; // 지방소득세 (소득세의 10%)
  totalDeduction: number; // 총 공제액
}

/**
 * 급여에 대한 세금 및 4대보험을 계산합니다.
 * @param monthlySalary 월 급여 총액 (비과세 포함)
 * @param nonTaxableAmount 비과세 급여 (식대, 차량유지비 등)
 * @param dependents 부양가족 수 (본인 포함)
 * @param isFreelancer 3.3% 사업소득자 여부
 */
export function calculateTaxes(
  monthlySalary: number,
  nonTaxableAmount: number = 200000,
  dependents: number = 1,
  isFreelancer: boolean = false
): TaxResult {
  const taxableIncome = monthlySalary - nonTaxableAmount;

  if (isFreelancer) {
    // 3.3% 사업소득자 (프리랜서)
    const tax = Math.floor(monthlySalary * 0.03);
    const localTax = Math.floor(tax * 0.1);
    
    return {
      nationalPension: 0,
      healthInsurance: 0,
      longTermCare: 0,
      employmentInsurance: 0,
      incomeTax: tax,
      localIncomeTax: localTax,
      totalDeduction: tax + localTax
    };
  }

  // 1. 국민연금 (상한/하한 적용)
  let pensionIncome = taxableIncome;
  if (pensionIncome < PENSION_LIMITS.min) pensionIncome = PENSION_LIMITS.min;
  if (pensionIncome > PENSION_LIMITS.max) pensionIncome = PENSION_LIMITS.max;
  const nationalPension = Math.floor((pensionIncome * TAX_RATES_2025.pension) / 10) * 10;

  // 2. 건강보험
  const healthInsurance = Math.floor((taxableIncome * TAX_RATES_2025.health) / 10) * 10;

  // 3. 장기요양보험 (건강보험료의 12.95%)
  const longTermCare = Math.floor((healthInsurance * TAX_RATES_2025.care) / 10) * 10;

  // 4. 고용보험
  const employmentInsurance = Math.floor((taxableIncome * TAX_RATES_2025.employment) / 10) * 10;

  // 5. 근로소득세 (간이세액표 적용)
  const incomeTax = calculateIncomeTax(taxableIncome, dependents);

  // 6. 지방소득세 (소득세의 10%)
  const localIncomeTax = Math.floor((incomeTax * 0.1) / 10) * 10;

  const totalDeduction = 
    nationalPension + 
    healthInsurance + 
    longTermCare + 
    employmentInsurance + 
    incomeTax + 
    localIncomeTax;

  return {
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    incomeTax,
    localIncomeTax,
    totalDeduction
  };
}
