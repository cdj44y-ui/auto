/**
 * P-09: 근로시간 정밀 엔진
 * 탄력적 근로시간제 (근기법 §51), 선택적 근로시간제 (근기법 §52), 주 52시간 정밀 검증
 */

interface AttendanceInput {
  clockIn: number;  // Unix ms
  clockOut: number | null;
}

// ============ 탄력적 근로시간제 (근기법 §51) ============

export interface FlexibleWorkParams {
  type: "2week" | "3month" | "6month";
  records: AttendanceInput[];
  agreedWeeklyHours: number; // 서면합의 주당 시간 (최대 52)
}

export interface FlexibleWorkResult {
  totalHours: number;
  weeklyAverage: number;
  isOvertime: boolean;
  overtimeHours: number;
  weeklyBreakdown: { week: number; hours: number; isOver: boolean }[];
}

export function calculateFlexibleWorkHours(params: FlexibleWorkParams): FlexibleWorkResult {
  const { records, agreedWeeklyHours } = params;
  const BREAK_MS = 3_600_000; // 1시간 휴게

  // 주차별 그룹핑
  const weekMap = new Map<number, number>();
  for (const r of records) {
    if (!r.clockOut) continue;
    const workMs = Math.max(0, r.clockOut - r.clockIn - BREAK_MS);
    const workDate = new Date(r.clockIn);
    // ISO 주차 계산
    const jan1 = new Date(workDate.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((workDate.getTime() - jan1.getTime()) / 86_400_000);
    const weekNum = Math.ceil((dayOfYear + jan1.getDay() + 1) / 7);
    weekMap.set(weekNum, (weekMap.get(weekNum) ?? 0) + workMs);
  }

  const weeklyBreakdown: FlexibleWorkResult["weeklyBreakdown"] = [];
  let totalMs = 0;
  const weeks = Array.from(weekMap.entries()).sort((a, b) => a[0] - b[0]);

  for (const [week, ms] of weeks) {
    const hours = ms / 3_600_000;
    totalMs += ms;
    // 탄력근로: 특정 주 최대 한도 (2주: 48시간, 3개월: 52시간, 6개월: 52시간)
    const weekLimit = params.type === "2week" ? 48 : 52;
    weeklyBreakdown.push({ week, hours: Math.round(hours * 10) / 10, isOver: hours > weekLimit });
  }

  const totalHours = totalMs / 3_600_000;
  const weekCount = Math.max(1, weeks.length);
  const weeklyAverage = totalHours / weekCount;
  // 정산기간 평균이 40시간 초과 시 연장근로
  const overtimeHours = Math.max(0, weeklyAverage - 40) * weekCount;

  return {
    totalHours: Math.round(totalHours * 10) / 10,
    weeklyAverage: Math.round(weeklyAverage * 10) / 10,
    isOvertime: overtimeHours > 0,
    overtimeHours: Math.round(overtimeHours * 10) / 10,
    weeklyBreakdown,
  };
}

// ============ 선택적 근로시간제 (근기법 §52) ============

export interface SelectiveWorkParams {
  settlementPeriod: { start: number; end: number }; // Unix ms
  records: AttendanceInput[];
  coreTimeStart?: string; // "HH:mm"
  coreTimeEnd?: string;   // "HH:mm"
}

export interface SelectiveWorkResult {
  totalHours: number;
  requiredHours: number;
  balance: number;
  coreTimeViolations: { date: string; reason: string }[];
}

export function calculateSelectiveWorkHours(params: SelectiveWorkParams): SelectiveWorkResult {
  const { settlementPeriod, records, coreTimeStart, coreTimeEnd } = params;
  const BREAK_MS = 3_600_000;

  // 정산기간 소정근로시간 = (정산기간 일수 / 7) × 40
  const periodDays = Math.ceil((settlementPeriod.end - settlementPeriod.start) / 86_400_000);
  const requiredHours = (periodDays / 7) * 40;

  let totalMs = 0;
  const violations: SelectiveWorkResult["coreTimeViolations"] = [];

  for (const r of records) {
    if (!r.clockOut) continue;
    const workMs = Math.max(0, r.clockOut - r.clockIn - BREAK_MS);
    totalMs += workMs;

    // 의무 시간대 위반 검사
    if (coreTimeStart && coreTimeEnd) {
      const clockInDate = new Date(r.clockIn);
      const clockInTime = `${String(clockInDate.getHours()).padStart(2, "0")}:${String(clockInDate.getMinutes()).padStart(2, "0")}`;
      const clockOutDate = new Date(r.clockOut);
      const clockOutTime = `${String(clockOutDate.getHours()).padStart(2, "0")}:${String(clockOutDate.getMinutes()).padStart(2, "0")}`;
      const dateStr = clockInDate.toISOString().slice(0, 10);

      if (clockInTime > coreTimeStart) {
        violations.push({ date: dateStr, reason: `의무시간 시작(${coreTimeStart}) 이후 출근(${clockInTime})` });
      }
      if (clockOutTime < coreTimeEnd) {
        violations.push({ date: dateStr, reason: `의무시간 종료(${coreTimeEnd}) 이전 퇴근(${clockOutTime})` });
      }
    }
  }

  const totalHours = totalMs / 3_600_000;
  const balance = totalHours - requiredHours;

  return {
    totalHours: Math.round(totalHours * 10) / 10,
    requiredHours: Math.round(requiredHours * 10) / 10,
    balance: Math.round(balance * 10) / 10,
    coreTimeViolations: violations,
  };
}

// ============ 주 52시간 정밀 검증 (근기법 §53) ============

export interface Validate52Params {
  userId: number;
  weekStart: number; // Unix ms (월요일 00:00)
  records: AttendanceInput[];
  hasSpecialExtension: boolean; // 특별연장근로 인가 여부
}

export interface Validate52Result {
  totalWeeklyHours: number;
  regularHours: number;
  overtimeHours: number;
  isViolation: boolean;
  remainingHours: number;
  riskLevel: "safe" | "caution" | "warning" | "danger";
}

export function validate52Hours(params: Validate52Params): Validate52Result {
  const { records, hasSpecialExtension } = params;
  const BREAK_MS = 3_600_000;

  let totalMs = 0;
  for (const r of records) {
    if (!r.clockOut) continue;
    totalMs += Math.max(0, r.clockOut - r.clockIn - BREAK_MS);
  }

  const totalWeeklyHours = totalMs / 3_600_000;
  const regularHours = Math.min(40, totalWeeklyHours);
  const overtimeHours = Math.max(0, totalWeeklyHours - 40);

  // 근기법 §53①: 주 12시간 한도 (특별연장 인가 시 추가 가능)
  const maxHours = hasSpecialExtension ? 60 : 52;
  const isViolation = totalWeeklyHours > maxHours;
  const remainingHours = Math.max(0, maxHours - totalWeeklyHours);

  let riskLevel: Validate52Result["riskLevel"];
  if (totalWeeklyHours > 52) riskLevel = "danger";
  else if (totalWeeklyHours > 48) riskLevel = "warning";
  else if (totalWeeklyHours > 44) riskLevel = "caution";
  else riskLevel = "safe";

  return {
    totalWeeklyHours: Math.round(totalWeeklyHours * 10) / 10,
    regularHours: Math.round(regularHours * 10) / 10,
    overtimeHours: Math.round(overtimeHours * 10) / 10,
    isViolation,
    remainingHours: Math.round(remainingHours * 10) / 10,
    riskLevel,
  };
}
