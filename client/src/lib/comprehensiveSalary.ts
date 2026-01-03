/**
 * 포괄임금제 역산 계산 유틸리티
 * 
 * 총 급여와 포함된 연장/야간/휴일 근로시간을 입력받아
 * 통상시급을 역산하고 각 수당 항목을 계산합니다.
 */

export interface ComprehensiveSalaryInput {
  totalSalary: number;        // 월 총 급여
  nonTaxableAmount: number;   // 비과세 수당 합계 (식대 등)
  weeklyWorkHours: number;    // 주 소정 근로시간 (보통 40시간)
  includedOvertimeHours: number; // 포괄 산정된 월 연장근로시간
  includedNightHours: number;    // 포괄 산정된 월 야간근로시간
  includedHolidayHours: number;  // 포괄 산정된 월 휴일근로시간
  isSmallBusiness: boolean;   // 5인 미만 사업장 여부
}

export interface ComprehensiveSalaryResult {
  hourlyRate: number;         // 통상시급
  baseSalary: number;         // 기본급
  overtimeAllowance: number;  // 연장근로수당
  nightAllowance: number;     // 야간근로수당
  holidayAllowance: number;   // 휴일근로수당
  totalCalculated: number;    // 계산된 합계 (검증용)
}

export function calculateComprehensiveSalary(input: ComprehensiveSalaryInput): ComprehensiveSalaryResult {
  const {
    totalSalary,
    nonTaxableAmount,
    weeklyWorkHours,
    includedOvertimeHours,
    includedNightHours,
    includedHolidayHours,
    isSmallBusiness
  } = input;

  // 1. 과세 대상 급여 (총 급여 - 비과세)
  const taxableSalary = totalSalary - nonTaxableAmount;

  // 2. 월 소정 근로시간 계산 (주휴 포함)
  // 주 40시간 기준: (40 + 8) * 365 / 7 / 12 ≈ 209시간
  const monthlyBaseHours = (weeklyWorkHours + (weeklyWorkHours >= 15 ? 8 : 0)) * 365 / 7 / 12;

  // 3. 가산율 적용 (5인 미만은 가산 없음)
  const overtimeRate = isSmallBusiness ? 1.0 : 1.5;
  const nightRate = isSmallBusiness ? 1.0 : 0.5; // 야간은 0.5배 추가 가산
  const holidayRate = isSmallBusiness ? 1.0 : 1.5;

  // 4. 총 환산 근로시간 (시수) 계산
  const totalHours = 
    monthlyBaseHours + 
    (includedOvertimeHours * overtimeRate) + 
    (includedNightHours * nightRate) + 
    (includedHolidayHours * holidayRate);

  // 5. 통상시급 역산
  // 시급 = 과세대상급여 / 총 환산 근로시간
  const hourlyRate = Math.round(taxableSalary / totalHours);

  // 6. 각 수당 항목 계산 (원 단위 절사)
  const baseSalary = Math.floor(hourlyRate * monthlyBaseHours / 10) * 10;
  const overtimeAllowance = Math.floor(hourlyRate * includedOvertimeHours * overtimeRate / 10) * 10;
  const nightAllowance = Math.floor(hourlyRate * includedNightHours * nightRate / 10) * 10;
  const holidayAllowance = Math.floor(hourlyRate * includedHolidayHours * holidayRate / 10) * 10;

  // 7. 합계 검증 및 보정 (원단위 절사로 인한 오차를 기본급에 반영)
  const calculatedSum = baseSalary + overtimeAllowance + nightAllowance + holidayAllowance;
  const diff = taxableSalary - calculatedSum;
  
  return {
    hourlyRate,
    baseSalary: baseSalary + diff, // 오차 보정
    overtimeAllowance,
    nightAllowance,
    holidayAllowance,
    totalCalculated: totalSalary
  };
}
