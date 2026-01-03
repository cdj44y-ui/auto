// 대한민국 공휴일 데이터 (2025-2026)
// 실제 운영 시에는 공공데이터포털 API 등을 연동하여 매년 업데이트 필요

export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
  isSubstitute?: boolean; // 대체공휴일 여부
}

const HOLIDAYS_2025: Holiday[] = [
  { date: "2025-01-01", name: "신정" },
  { date: "2025-01-28", name: "설날 연휴" },
  { date: "2025-01-29", name: "설날" },
  { date: "2025-01-30", name: "설날 연휴" },
  { date: "2025-03-01", name: "삼일절" },
  { date: "2025-03-03", name: "대체공휴일(삼일절)", isSubstitute: true },
  { date: "2025-05-05", name: "어린이날" },
  { date: "2025-05-06", name: "대체공휴일(어린이날)", isSubstitute: true },
  { date: "2025-05-06", name: "부처님오신날" }, // 2025년 부처님오신날은 5/5 어린이날과 겹침 -> 대체공휴일 적용 여부 확인 필요 (여기서는 단순화)
  { date: "2025-06-06", name: "현충일" },
  { date: "2025-08-15", name: "광복절" },
  { date: "2025-10-03", name: "개천절" },
  { date: "2025-10-05", name: "추석 연휴" },
  { date: "2025-10-06", name: "추석" },
  { date: "2025-10-07", name: "추석 연휴" },
  { date: "2025-10-08", name: "대체공휴일(추석)", isSubstitute: true },
  { date: "2025-10-09", name: "한글날" },
  { date: "2025-12-25", name: "성탄절" },
];

const HOLIDAYS_2026: Holiday[] = [
  { date: "2026-01-01", name: "신정" },
  { date: "2026-02-16", name: "설날 연휴" },
  { date: "2026-02-17", name: "설날" },
  { date: "2026-02-18", name: "설날 연휴" },
  { date: "2026-03-01", name: "삼일절" },
  { date: "2026-03-02", name: "대체공휴일(삼일절)", isSubstitute: true },
  { date: "2026-05-05", name: "어린이날" },
  { date: "2026-05-24", name: "부처님오신날" },
  { date: "2026-05-25", name: "대체공휴일(부처님오신날)", isSubstitute: true },
  { date: "2026-06-06", name: "현충일" },
  { date: "2026-08-15", name: "광복절" },
  { date: "2026-09-24", name: "추석 연휴" },
  { date: "2026-09-25", name: "추석" },
  { date: "2026-09-26", name: "추석 연휴" },
  { date: "2026-10-03", name: "개천절" },
  { date: "2026-10-09", name: "한글날" },
  { date: "2026-12-25", name: "성탄절" },
];

const ALL_HOLIDAYS = [...HOLIDAYS_2025, ...HOLIDAYS_2026];

/**
 * 특정 날짜가 공휴일인지 확인합니다.
 * @param date 확인할 날짜 (Date 객체 또는 YYYY-MM-DD 문자열)
 * @returns 공휴일 정보 객체 또는 null
 */
export function getHoliday(date: Date | string): Holiday | null {
  const dateString = typeof date === 'string' 
    ? date 
    : date.toISOString().split('T')[0];
    
  return ALL_HOLIDAYS.find(h => h.date === dateString) || null;
}

/**
 * 특정 날짜가 휴일(주말 또는 공휴일)인지 확인합니다.
 * @param date 확인할 날짜
 * @returns boolean
 */
export function isHolidayOrWeekend(date: Date): boolean {
  const day = date.getDay();
  const isWeekend = day === 0 || day === 6; // 일요일(0) 또는 토요일(6)
  const isPublicHoliday = !!getHoliday(date);
  
  return isWeekend || isPublicHoliday;
}

/**
 * 특정 기간 내의 공휴일 목록을 반환합니다.
 * @param startDate 시작일
 * @param endDate 종료일
 */
export function getHolidaysInPeriod(startDate: Date, endDate: Date): Holiday[] {
  const start = startDate.toISOString().split('T')[0];
  const end = endDate.toISOString().split('T')[0];
  
  return ALL_HOLIDAYS.filter(h => h.date >= start && h.date <= end);
}
