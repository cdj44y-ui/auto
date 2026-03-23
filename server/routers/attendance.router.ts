/**
 * P-03: Attendance Router — 출퇴근 관리
 * P-02: 테넌트 격리 적용 (ctx.clientFilter)
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../_core/trpc";
import { writeAuditLog } from "../middleware/audit";
import * as db from "../db";

export const attendanceRouter = router({
  clockIn: protectedProcedure.mutation(async ({ ctx }) => {
    const existing = await db.getTodayAttendance(ctx.user.id);
    if (existing && !existing.clockOut) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: '이미 출근 처리되었습니다.' });
    }
    const id = await db.clockIn(ctx.user.id, ctx.user.clientId);
    await writeAuditLog({
      userId: ctx.user.id, clientId: ctx.user.clientId ?? null,
      action: 'create', tableName: 'attendance_records', recordId: id,
      newValue: { clockIn: Date.now() },
    });
    return { id, success: true };
  }),

  clockOut: protectedProcedure.mutation(async ({ ctx }) => {
    const today = await db.getTodayAttendance(ctx.user.id);
    if (!today || today.clockOut) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: '출근 기록이 없거나 이미 퇴근 처리되었습니다.' });
    }
    await db.clockOut(today.id);
    await writeAuditLog({
      userId: ctx.user.id, clientId: ctx.user.clientId ?? null,
      action: 'update', tableName: 'attendance_records', recordId: today.id,
      newValue: { clockOut: Date.now() },
    });
    return { success: true };
  }),

  today: protectedProcedure.query(async ({ ctx }) => {
    return db.getTodayAttendance(ctx.user.id);
  }),

  history: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(100).optional() }).optional())
    .query(async ({ ctx, input }) => {
      return db.getAttendanceByUser(ctx.user.id, input?.limit ?? 30, ctx.user.clientId);
    }),
});
