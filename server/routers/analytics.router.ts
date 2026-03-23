/**
 * P-03: Analytics Router — 근태 통계/분석
 * P-02: 테넌트 격리 적용 (ctx.clientFilter)
 */
import { z } from "zod";
import { router } from "../_core/trpc";
import { companyAdminProcedure } from "../middleware/tenant";
import * as db from "../db";

export const analyticsRouter = router({
  monthlySummary: companyAdminProcedure
    .input(z.object({ year: z.number(), month: z.number(), clientId: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      // P-02: clientFilter 우선, super_admin은 input.clientId 사용 가능
      const effectiveClientId = ctx.clientFilter ?? input.clientId ?? null;
      return db.getMonthlyAttendanceSummary(input.year, input.month, effectiveClientId);
    }),

  weeklyOvertimeAlerts: companyAdminProcedure
    .input(z.object({ clientId: z.number().optional() }).optional())
    .query(async ({ input, ctx }) => {
      const effectiveClientId = ctx.clientFilter ?? input?.clientId ?? null;
      return db.getWeeklyOvertimeAlerts(effectiveClientId);
    }),

  anomalies: companyAdminProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return db.detectAnomalies(input.userId);
    }),
});
