/**
 * P-09: 근로시간 정밀 엔진 단위 테스트
 * - 주 52시간 검증
 * - 탄력적 근로시간제
 * - 선택적 근로시간제
 */
import { describe, it, expect } from "vitest";
import { validate52Hours, calculateFlexibleWorkHours, calculateSelectiveWorkHours } from "./services/worktime.service";

describe("P-09: 주 52시간 검증 (validate52Hours)", () => {
  const weekStart = new Date("2026-03-16T00:00:00+09:00").getTime(); // 월요일

  it("정상 근무 (40시간) → 위반 없음", () => {
    const records = [];
    for (let i = 0; i < 5; i++) {
      const day = weekStart + i * 24 * 3_600_000;
      records.push({
        clockIn: day + 9 * 3_600_000,  // 09:00
        clockOut: day + 18 * 3_600_000, // 18:00
      });
    }
    const result = validate52Hours({ userId: 1, weekStart, records, hasSpecialExtension: false });
    expect(result.isViolation).toBe(false);
    // 5일 * 8시간 = 40시간 (휴게 1시간 제외)
    expect(result.totalWeeklyHours).toBeCloseTo(40, 0);
  });

  it("주 52시간 초과 → 위반 감지", () => {
    const records = [];
    for (let i = 0; i < 6; i++) {
      const day = weekStart + i * 24 * 3_600_000;
      records.push({
        clockIn: day + 7 * 3_600_000,   // 07:00
        clockOut: day + 22 * 3_600_000,  // 22:00 (14시간 - 1시간 휴게 = 13시간)
      });
    }
    const result = validate52Hours({ userId: 1, weekStart, records, hasSpecialExtension: false });
    expect(result.isViolation).toBe(true);
    expect(result.totalWeeklyHours).toBeGreaterThan(52);
  });

  it("특별연장 적용 시 60시간까지 허용", () => {
    const records = [];
    for (let i = 0; i < 6; i++) {
      const day = weekStart + i * 24 * 3_600_000;
      records.push({
        clockIn: day + 8 * 3_600_000,
        clockOut: day + 19 * 3_600_000, // 10시간 (휴게 제외)
      });
    }
    const result = validate52Hours({ userId: 1, weekStart, records, hasSpecialExtension: true });
    // 6일 * 10시간 = 60시간
    expect(result.totalWeeklyHours).toBeCloseTo(60, 0);
    expect(result.isViolation).toBe(false);
  });
});

describe("P-09: 탄력적 근로시간제 (calculateFlexibleWorkHours)", () => {
  it("2주 단위 탄력근로 — 평균 40시간 이내 → 정상", () => {
    const records = [];
    const start = new Date("2026-03-16T00:00:00+09:00").getTime();
    // 1주차: 48시간 (6일 * 8시간)
    for (let i = 0; i < 6; i++) {
      const day = start + i * 24 * 3_600_000;
      records.push({ clockIn: day + 9 * 3_600_000, clockOut: day + 18 * 3_600_000 });
    }
    // 2주차: 32시간 (4일 * 8시간)
    for (let i = 7; i < 11; i++) {
      const day = start + i * 24 * 3_600_000;
      records.push({ clockIn: day + 9 * 3_600_000, clockOut: day + 18 * 3_600_000 });
    }

    const result = calculateFlexibleWorkHours({
      type: "2week",
      records,
      agreedWeeklyHours: 40,
    });

    expect(result.weeklyAverage).toBeCloseTo(40, 0);
    expect(result.isOvertime).toBe(false);
  });
});

describe("P-09: 선택적 근로시간제 (calculateSelectiveWorkHours)", () => {
  it("1개월 정산기간 — 평균 주 40시간 이내 → 정상", () => {
    const start = new Date("2026-03-01T00:00:00+09:00").getTime();
    const end = new Date("2026-03-31T23:59:59+09:00").getTime();
    const records = [];

    // 22일 근무, 하루 8시간
    let dayCount = 0;
    for (let d = 0; d < 31 && dayCount < 22; d++) {
      const date = new Date(start + d * 24 * 3_600_000);
      const dow = date.getDay();
      if (dow === 0 || dow === 6) continue;
      records.push({
        clockIn: start + d * 24 * 3_600_000 + 9 * 3_600_000,
        clockOut: start + d * 24 * 3_600_000 + 18 * 3_600_000,
      });
      dayCount++;
    }

    const result = calculateSelectiveWorkHours({
      settlementPeriod: { start, end },
      records,
    });

    expect(result.balance).toBeLessThanOrEqual(0.5); // roughly balanced
    expect(result.totalHours).toBeGreaterThan(0);
  });
});
