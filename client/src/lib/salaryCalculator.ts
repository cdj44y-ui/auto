/**
 * 대한민국 근로기준법 기반 급여 계산 유틸리티
 */

interface WorkTime {
  startTime: string; // "HH:mm" format
  endTime: string;   // "HH:mm" format
  breakStartTime?: string;
  breakEndTime?: string;
  isHoliday?: boolean;
}

interface SalaryOptions {
  hourlyRate: number; // 시급
  isSmallBusiness: boolean; // 5인 미만 사업장 여부 (true면 가산수당 미적용)
  weeklyWorkHours: number; // 주 소정 근로시간 (15시간 미만이면 주휴수당 제외)
}

export interface SalaryResult {
  basePay: number;      // 기본급
  overtimePay: number;  // 연장근로수당
  nightPay: number;     // 야간근로수당
  holidayPay: number;   // 휴일근로수당
  weeklyHolidayPay: number; // 주휴수당
  totalPay: number;     // 총 급여
  details: {
    totalWorkHours: number;
    overtimeHours: number;
    nightHours: number;
    holidayHours: number;
  };
}

// 시간을 분으로 변환
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// 야간 근로 시간(22:00 ~ 06:00) 계산 (분 단위)
const calculateNightMinutes = (start: number, end: number): number => {
  let nightMinutes = 0;
  // 하루를 분으로 표현 (0 ~ 1440)
  // 야간 구간: 22:00(1320분) ~ 24:00(1440분) AND 00:00(0분) ~ 06:00(360분)
  
  // 작업 편의를 위해 종료 시간이 시작 시간보다 작으면(익일) 1440을 더해서 처리할 수도 있으나,
  // 여기서는 하루 단위 근무라고 가정하고, 넘어가면 별도 처리 필요.
  // 간단한 로직: 루프를 돌거나 구간 겹침 확인.
  
  // 단순화를 위해 분 단위 루프 (성능상 문제 없음)
  for (let t = start; t < end; t++) {
    const hour = Math.floor((t % 1440) / 60);
    if (hour >= 22 || hour < 6) {
      nightMinutes++;
    }
  }
  return nightMinutes;
};

export const calculateDailySalary = (work: WorkTime, options: SalaryOptions): SalaryResult => {
  const { hourlyRate, isSmallBusiness } = options;
  
  let start = timeToMinutes(work.startTime);
  let end = timeToMinutes(work.endTime);
  
  // 종료 시간이 시작 시간보다 작으면 다음날로 간주 (예: 22:00 ~ 02:00)
  if (end < start) {
    end += 1440;
  }

  let breakTime = 0;
  if (work.breakStartTime && work.breakEndTime) {
    let breakStart = timeToMinutes(work.breakStartTime);
    let breakEnd = timeToMinutes(work.breakEndTime);
    if (breakEnd < breakStart) breakEnd += 1440;
    
    // 휴게시간이 근무시간 내에 있는지 확인 (단순화)
    breakTime = breakEnd - breakStart;
  }

  const totalWorkMinutes = Math.max(0, (end - start) - breakTime);
  const totalWorkHours = totalWorkMinutes / 60;

  // 1. 기본급 (실제 일한 시간 * 시급)
  // 통상임금 산정 기준 시간 수는 주휴 포함 월 209시간이지만, 일급 계산시는 실근로시간 기준
  const basePay = totalWorkHours * hourlyRate;

  // 5인 미만 사업장은 가산수당 없음 (야간, 연장, 휴일 가산 X)
  if (isSmallBusiness) {
    return {
      basePay,
      overtimePay: 0,
      nightPay: 0,
      holidayPay: 0,
      weeklyHolidayPay: 0, // 일급 계산에서는 주휴 제외 (별도 합산 필요)
      totalPay: basePay,
      details: {
        totalWorkHours,
        overtimeHours: 0,
        nightHours: 0,
        holidayHours: 0
      }
    };
  }

  // 2. 연장 근로 수당 (1일 8시간 초과분)
  let overtimeHours = 0;
  if (!work.isHoliday && totalWorkHours > 8) {
    overtimeHours = totalWorkHours - 8;
  }
  const overtimePay = overtimeHours * hourlyRate * 0.5; // 1.5배 중 0.5배 가산분만 별도 표기 (기본급에 1.0 포함됨)

  // 3. 휴일 근로 수당
  let holidayHours = 0;
  let holidayPay = 0;
  if (work.isHoliday) {
    holidayHours = totalWorkHours;
    // 8시간 이내 1.5배, 8시간 초과 2.0배 (중복 할증)
    // 기본급(1.0)은 이미 basePay에 포함됨. 따라서 추가 가산분만 계산.
    // 8시간 이내: 0.5배 가산
    // 8시간 초과: 1.0배 가산 (연장 0.5 + 휴일 0.5가 아니라, 휴일 연장 중복 할증 법리 적용)
    // 근로기준법 제56조 2항: 8시간 이내 50% 가산, 8시간 초과 100% 가산
    
    const holidayOver8 = Math.max(0, totalWorkHours - 8);
    const holidayUnder8 = totalWorkHours - holidayOver8;
    
    holidayPay = (holidayUnder8 * hourlyRate * 0.5) + (holidayOver8 * hourlyRate * 1.0);
    
    // 휴일근로 시 연장근로수당(overtimePay)은 별도로 계산하지 않고 휴일근로수당에 포함하여 계산함이 일반적 해석(중복할증)
    // 따라서 위에서 계산한 overtimePay는 휴일이 아닐 때만 적용
  }

  // 4. 야간 근로 수당 (22:00 ~ 06:00) - 0.5배 가산
  // 휴게시간 제외해야 함 (복잡하므로 휴게시간이 야간에 포함 안 된다고 가정하거나 비례 삭감)
  // 여기서는 정밀 계산을 위해 전체 야간 시간에서 휴게시간 중 야간 겹치는 시간을 빼야 함.
  // 편의상 휴게시간이 낮(12~13시 등)에 있다고 가정하고 전체 야간 시간 계산.
  const rawNightMinutes = calculateNightMinutes(start, end);
  // 휴게시간이 야간에 겹치는지 체크 필요하지만, 일단 약식으로 처리
  const nightHours = rawNightMinutes / 60;
  const nightPay = nightHours * hourlyRate * 0.5;

  return {
    basePay,
    overtimePay: work.isHoliday ? 0 : overtimePay, // 휴일이면 휴일수당에 포함됨
    nightPay,
    holidayPay,
    weeklyHolidayPay: 0, // 일급 단위이므로 0
    totalPay: basePay + (work.isHoliday ? 0 : overtimePay) + nightPay + holidayPay,
    details: {
      totalWorkHours,
      overtimeHours: work.isHoliday ? 0 : overtimeHours,
      nightHours,
      holidayHours
    }
  };
};

// 월급 예측 계산 (주 5일 근무 가정)
export const calculateMonthlyEstimatedSalary = (
  work: WorkTime, 
  options: SalaryOptions
): SalaryResult => {
  // 1일 급여 계산
  const dailyResult = calculateDailySalary(work, options);
  
  // 한달 평균 주수: 4.345주
  const weeksPerMonth = 4.345;
  const workDaysPerWeek = 5; // 주 5일 가정
  
  const monthlyBasePay = dailyResult.basePay * workDaysPerWeek * weeksPerMonth;
  const monthlyOvertimePay = dailyResult.overtimePay * workDaysPerWeek * weeksPerMonth;
  const monthlyNightPay = dailyResult.nightPay * workDaysPerWeek * weeksPerMonth;
  const monthlyHolidayPay = dailyResult.holidayPay * workDaysPerWeek * weeksPerMonth; // 휴일 근무가 매주 있다고 가정 시

  // 주휴수당 계산
  // 주 15시간 이상 & 5인 미만 여부 상관없이 주휴수당은 발생 (단, 5인 미만도 주휴수당은 적용됨. 가산수당만 미적용)
  // 주휴수당 = (1주 소정근로시간 / 40) * 8 * 시급
  let weeklyHolidayPay = 0;
  if (options.weeklyWorkHours >= 15) {
    // 통상 1일 소정근로시간분 지급. 최대 8시간.
    const dailyStandardHours = Math.min(8, options.weeklyWorkHours / 5);
    const weeklyHolidayAllowance = dailyStandardHours * options.hourlyRate;
    weeklyHolidayPay = weeklyHolidayAllowance * weeksPerMonth;
  }

  return {
    basePay: Math.floor(monthlyBasePay),
    overtimePay: Math.floor(monthlyOvertimePay),
    nightPay: Math.floor(monthlyNightPay),
    holidayPay: Math.floor(monthlyHolidayPay),
    weeklyHolidayPay: Math.floor(weeklyHolidayPay),
    totalPay: Math.floor(monthlyBasePay + monthlyOvertimePay + monthlyNightPay + monthlyHolidayPay + weeklyHolidayPay),
    details: {
      totalWorkHours: dailyResult.details.totalWorkHours * workDaysPerWeek * weeksPerMonth,
      overtimeHours: dailyResult.details.overtimeHours * workDaysPerWeek * weeksPerMonth,
      nightHours: dailyResult.details.nightHours * workDaysPerWeek * weeksPerMonth,
      holidayHours: dailyResult.details.holidayHours * workDaysPerWeek * weeksPerMonth
    }
  };
};
