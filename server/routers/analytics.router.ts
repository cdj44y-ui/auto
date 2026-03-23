/**
 * P-03/P-09/P-10: Analytics Router
 * - P-09: 탄력/선택적 근로시간 분석
 * - P-10: 자문사 대시보드 + 고객사 헬스스코어
 */
import { z } from "zod";
import { router } from "../_core/trpc";
import { companyAdminProcedure, consultantProcedure, tenantAdminProcedure } from "../middleware/tenant";
import * as db from "../db";
import { calculateFlexibleWorkHours, calculateSelectiveWorkHours } from "../services/worktime.service";

export const analyticsRouter = router({
  /** 월간 출근 요약 */
  monthlySummary: companyAdminProcedure
    .input(z.object({ year: z.number(), month: z.number(), clientId: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      const effectiveClientId = ctx.clientFilter ?? input.clientId ?? null;
      return db.getMonthlyAttendanceSummary(input.year, input.month, effectiveClientId);
    }),

  /** 주간 초과근무 알림 */
  weeklyOvertimeAlerts: companyAdminProcedure
    .input(z.object({ clientId: z.number().optional() }).optional())
    .query(async ({ input, ctx }) => {
      const effectiveClientId = ctx.clientFilter ?? input?.clientId ?? null;
      return db.getWeeklyOvertimeAlerts(effectiveClientId);
    }),

  /** 이상 징후 감지 */
  anomalies: companyAdminProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return db.detectAnomalies(input.userId);
    }),

  /** P-09: 탄력적 근로시간제 분석 */
  flexibleWork: companyAdminProcedure
    .input(z.object({
      userId: z.number(),
      type: z.enum(["2week", "3month", "6month"]),
      startDate: z.number(), // Unix ms
      endDate: z.number(),
      agreedWeeklyHours: z.number().min(1).max(52).default(40),
    }))
    .query(async ({ input, ctx }) => {
      const records = await db.getAttendanceByUser(input.userId, 500, ctx.clientFilter);
      const filtered = records.filter(r => r.clockIn >= input.startDate && r.clockIn <= input.endDate);
      return calculateFlexibleWorkHours({
        type: input.type,
        records: filtered.map(r => ({ clockIn: r.clockIn, clockOut: r.clockOut })),
        agreedWeeklyHours: input.agreedWeeklyHours,
      });
    }),

  /** P-09: 선택적 근로시간제 분석 */
  selectiveWork: companyAdminProcedure
    .input(z.object({
      userId: z.number(),
      startDate: z.number(),
      endDate: z.number(),
      coreTimeStart: z.string().optional(),
      coreTimeEnd: z.string().optional(),
    }))
    .query(async ({ input, ctx }) => {
      const records = await db.getAttendanceByUser(input.userId, 500, ctx.clientFilter);
      const filtered = records.filter(r => r.clockIn >= input.startDate && r.clockIn <= input.endDate);
      return calculateSelectiveWorkHours({
        settlementPeriod: { start: input.startDate, end: input.endDate },
        records: filtered.map(r => ({ clockIn: r.clockIn, clockOut: r.clockOut })),
        coreTimeStart: input.coreTimeStart,
        coreTimeEnd: input.coreTimeEnd,
      });
    }),

  /** P-10: 자문사 대시보드 — 전체 고객사 헬스스코어 */
  clientHealthScores: consultantProcedure.query(async () => {
    return db.getClientHealthScores();
  }),

  /** P-10: 자문사 대시보드 — 고객사 요약 통계 */
  consultantDashboard: consultantProcedure.query(async () => {
    const clients = await db.getAllClients();
    const scores = await db.getClientHealthScores();

    const activeClients = clients.filter(c => c.isActive);
    const healthyCount = scores.filter(s => s.grade === "healthy").length;
    const atRiskCount = scores.filter(s => s.grade === "at_risk").length;
    const criticalCount = scores.filter(s => s.grade === "critical").length;
    const avgScore = scores.length > 0
      ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
      : 0;

    return {
      totalClients: clients.length,
      activeClients: activeClients.length,
      avgHealthScore: avgScore,
      healthyCount,
      atRiskCount,
      criticalCount,
      recentScores: scores.slice(0, 10),
    };
  }),
});
