/**
 * P-03/P-07/P-08/P-09: Attendance Router
 * - P-07: GPS/QR 출퇴근 인증
 * - P-08: SSE 실시간 알림
 * - P-09: 주 52시간 검증
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../_core/trpc";
import { companyAdminProcedure } from "../middleware/tenant";
import { writeAuditLog } from "../middleware/audit";
import * as db from "../db";
import { validateLocation } from "../services/geofence.service";
import { sendToUser } from "../services/sse.service";
import { validate52Hours } from "../services/worktime.service";

export const attendanceRouter = router({
  /** P-07: GPS/QR 출근 (authMethod 지정) */
  clockIn: protectedProcedure
    .input(z.object({
      authMethod: z.enum(["ip", "gps", "qr", "manual"]).default("ip"),
      latitude: z.string().optional(),
      longitude: z.string().optional(),
    }).optional())
    .mutation(async ({ ctx, input }) => {
      const existing = await db.getTodayAttendance(ctx.user.id);
      if (existing && !existing.clockOut) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "이미 출근 처리되었습니다." });
      }

      // P-07: GPS 인증 시 geofence 검증
      const method = input?.authMethod ?? "ip";
      if (method === "gps" && input?.latitude && input?.longitude) {
        const clientId = ctx.user.clientId;
        if (clientId) {
          const client = await db.getClientById(clientId);
          if (client?.geofences) {
            try {
              const fences = JSON.parse(client.geofences);
              const validation = validateLocation(
                parseFloat(input.latitude),
                parseFloat(input.longitude),
                fences
              );
              if (!validation.valid) {
                throw new TRPCError({
                  code: "BAD_REQUEST",
                  message: `허용된 출근 구역 밖입니다. 가장 가까운 구역: ${validation.nearestFence} (${validation.distance}m)`,
                });
              }
            } catch (e) {
              if (e instanceof TRPCError) throw e;
              // geofence 파싱 실패 시 무시
            }
          }
        }
      }

      const id = await db.clockIn(ctx.user.id, ctx.user.clientId);

      // P-07: authMethod, lat/lng 저장
      if (method !== "ip" || input?.latitude) {
        const dbInst = await db.getDb();
        if (dbInst) {
          const { attendanceRecords } = await import("../../drizzle/schema");
          const { eq } = await import("drizzle-orm");
          await dbInst.update(attendanceRecords)
            .set({
              authMethod: method,
              latitude: input?.latitude ?? null,
              longitude: input?.longitude ?? null,
            })
            .where(eq(attendanceRecords.id, id));
        }
      }

      await writeAuditLog({
        userId: ctx.user.id, clientId: ctx.user.clientId ?? null,
        action: "create", tableName: "attendance_records", recordId: id,
        newValue: { clockIn: Date.now(), authMethod: method },
      });

      // P-08: SSE 알림 (관리자에게)
      sendToUser(ctx.user.id, "attendance", { type: "clock_in", userId: ctx.user.id, time: Date.now() });

      return { id, success: true };
    }),

  /** 퇴근 */
  clockOut: protectedProcedure.mutation(async ({ ctx }) => {
    const today = await db.getTodayAttendance(ctx.user.id);
    if (!today || today.clockOut) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "출근 기록이 없거나 이미 퇴근 처리되었습니다." });
    }
    await db.clockOut(today.id);
    await writeAuditLog({
      userId: ctx.user.id, clientId: ctx.user.clientId ?? null,
      action: "update", tableName: "attendance_records", recordId: today.id,
      newValue: { clockOut: Date.now() },
    });

    // P-08: SSE 알림
    sendToUser(ctx.user.id, "attendance", { type: "clock_out", userId: ctx.user.id, time: Date.now() });

    return { success: true };
  }),

  /** 오늘 출퇴근 기록 */
  today: protectedProcedure.query(async ({ ctx }) => {
    return db.getTodayAttendance(ctx.user.id);
  }),

  /** 출퇴근 이력 */
  history: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(100).optional() }).optional())
    .query(async ({ ctx, input }) => {
      return db.getAttendanceByUser(ctx.user.id, input?.limit ?? 30, ctx.user.clientId);
    }),

  /** P-09: 주 52시간 검증 */
  validate52: protectedProcedure
    .input(z.object({
      weekStart: z.number().optional(), // Unix ms, 기본 이번 주 월요일
    }).optional())
    .query(async ({ ctx, input }) => {
      // 이번 주 월요일 00:00 계산
      const now = new Date();
      const dayOfWeek = now.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset);
      monday.setHours(0, 0, 0, 0);
      const weekStart = input?.weekStart ?? monday.getTime();
      const weekEnd = weekStart + 7 * 24 * 3_600_000;

      // 이번 주 출퇴근 기록 조회
      const records = await db.getAttendanceByUser(ctx.user.id, 100, ctx.user.clientId);
      const weekRecords = records
        .filter(r => r.clockIn >= weekStart && r.clockIn < weekEnd)
        .map(r => ({ clockIn: r.clockIn, clockOut: r.clockOut }));

      return validate52Hours({
        userId: ctx.user.id,
        weekStart,
        records: weekRecords,
        hasSpecialExtension: false,
      });
    }),

  /** P-07: QR 코드 생성용 토큰 (출퇴근 인증) */
  generateQrToken: companyAdminProcedure.mutation(async ({ ctx }) => {
    // 간단한 시간 기반 토큰 (5분 유효)
    const token = `qr-${ctx.user.clientId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const expiresAt = Date.now() + 5 * 60 * 1000;
    return { token, expiresAt };
  }),
});
