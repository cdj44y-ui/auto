import { differenceInMonths, differenceInYears, parseISO, startOfYear, endOfYear, format } from "date-fns";

export type LeaveCalculationMethod = 'fiscal_year' | 'join_date';

export interface AnnualLeaveResult {
  userId: string;
  joinDate: string;
  calculationDate: string; // 기준일 (회계연도 말일 또는 입사일 기준 1년)
  yearsOfService: number; // 근속년수
  monthsOfService: number; // 근속월수
  
  // 발생 연차
  generatedLeave: {
    annual: number; // 기본 연차 (15일~)
    monthly: number; // 1년 미만 월차 (최대 11일)
    longService: number; // 근속 가산 연차
    total: number; // 합계
  };
  
  // 이월/조정
  carriedOver: number; // 전년도 이월
  adjusted: number; // 조정일수 (마이너스 가능)
  
  // 사용/잔여
  used: number;
  remaining: number;
}

/**
 * 근속년수에 따른 법정 연차 발생 일수 계산 (근로기준법 제60조)
 * 1년 미만: 1개월 개근 시 1일 (최대 11일)
 * 1년 이상: 15일
 * 3년 이상: 최초 1년을 초과하는 매 2년마다 1일 가산 (최대 25일)
 */
export function calculateLegalLeaveDays(yearsOfService: number): number {
  if (yearsOfService < 1) return 0; // 1년 미만은 월차로 별도 계산
  
  // 기본 15일 + (근속년수 - 1) / 2 의 몫 (소수점 버림)
  const additionalDays = Math.floor((yearsOfService - 1) / 2);
  const totalDays = 15 + additionalDays;
  
  return Math.min(totalDays, 25); // 최대 25일 한도
}

/**
 * 회계연도 기준 연차 계산
 * - 1년 미만자: 입사일 ~ 12.31 근속기간에 비례하여 발생 (15일 * 근속일수 / 365일)
 * - 1년 이상자: 회계연도(1.1) 기준 근속년수에 따라 발생
 */
export function calculateFiscalYearLeave(
  joinDateStr: string, 
  fiscalYearEndStr: string = `${new Date().getFullYear()}-12-31`
): { annual: number; monthly: number; years: number } {
  const joinDate = parseISO(joinDateStr);
  const fiscalEnd = parseISO(fiscalYearEndStr);
  
  const yearsOfService = differenceInYears(fiscalEnd, joinDate);
  const monthsOfService = differenceInMonths(fiscalEnd, joinDate);
  
  let annual = 0;
  let monthly = 0;

  if (yearsOfService < 1) {
    // 1년 미만자: 비례 연차 (15 * 근속일수 / 365)
    // 단, 회계연도 기준이라도 1년 미만 기간 동안은 매월 개근 시 1일의 월차가 발생함
    // 실무적으로는 다음 해 1.1에 비례 연차를 부여하고, 입사 1년차에는 월차를 사용함
    const daysOfService = Math.floor((fiscalEnd.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    annual = parseFloat(((15 * daysOfService) / 365).toFixed(1)); // 소수점 첫째자리까지
    monthly = Math.min(monthsOfService, 11); // 입사 1년차 월차
  } else {
    // 1년 이상자: 정상 법정 연차 발생
    annual = calculateLegalLeaveDays(yearsOfService);
    monthly = 0; // 2년차부터는 월차 없음 (연차에 통합)
  }

  return { annual, monthly, years: yearsOfService };
}

/**
 * 입사일 기준 연차 계산
 * - 입사일로부터 1년이 되는 날마다 연차 발생
 */
export function calculateJoinDateLeave(
  joinDateStr: string,
  targetDateStr: string = new Date().toISOString().split('T')[0]
): { annual: number; monthly: number; years: number } {
  const joinDate = parseISO(joinDateStr);
  const targetDate = parseISO(targetDateStr);
  
  const yearsOfService = differenceInYears(targetDate, joinDate);
  const monthsOfService = differenceInMonths(targetDate, joinDate);
  
  let annual = 0;
  let monthly = 0;

  if (yearsOfService < 1) {
    annual = 0;
    monthly = Math.min(monthsOfService, 11);
  } else {
    annual = calculateLegalLeaveDays(yearsOfService);
    monthly = 0;
  }

  return { annual, monthly, years: yearsOfService };
}
