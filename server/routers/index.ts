/**
 * P-03: 라우터 인덱스 — 모든 도메인 라우터를 합쳐 appRouter로 export
 */
import { router, adminProcedure } from "../_core/trpc";
import { systemRouter } from "../_core/systemRouter";
import { z } from "zod";
import * as db from "../db";

// Domain routers
import { authRouter } from "./auth.router";
import { employeeRouter } from "./employee.router";
import { payrollRouter } from "./payroll.router";
import { attendanceRouter } from "./attendance.router";
import { analyticsRouter } from "./analytics.router";
import { clientRouter } from "./client.router";
import { consultationRouter } from "./consultation.router";
import { notificationRouter } from "./notification.router";
import { privacyRouter } from "./privacy.router";

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  employee: employeeRouter,
  payroll: payrollRouter,
  attendance: attendanceRouter,
  analytics: analyticsRouter,
  consultationMgmt: consultationRouter,
  clientMgmt: clientRouter,
  notification: notificationRouter,
  privacy: privacyRouter,

  // ============ User Role Management (super_admin Only) ============
  admin: router({
    updateUserRole: adminProcedure
      .input(z.object({
        userId: z.number(),
        role: z.enum(['super_admin', 'consultant', 'company_admin', 'company_hr', 'company_finance', 'employee']),
      }))
      .mutation(async ({ input }) => {
        const db_instance = await db.getDb();
        if (!db_instance) throw new Error("Database not available");
        
        const { users } = await import('../../drizzle/schema');
        const { eq } = await import('drizzle-orm');
        
        await db_instance.update(users)
          .set({ role: input.role })
          .where(eq(users.id, input.userId));
        
        return { success: true };
      }),
  }),

  // ============ Audit Log Viewer (super_admin Only) ============
  auditLog: router({
    list: adminProcedure
      .input(z.object({
        limit: z.number().min(1).max(100).optional(),
        offset: z.number().min(0).optional(),
      }).optional())
      .query(async ({ input }) => {
        return db.getAuditLogs(input?.limit ?? 50, input?.offset ?? 0);
      }),
  }),

  // ============ Client Health (super_admin Only) ============
  clientHealth: router({
    scores: adminProcedure.query(async () => {
      return db.getClientHealthScores();
    }),
  }),
});

export type AppRouter = typeof appRouter;
