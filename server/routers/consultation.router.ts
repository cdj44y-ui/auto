/**
 * P-03: Consultation Router — 자문이력 관리 CRUD
 * P-02: consultant 역할은 자신이 담당한 고객사만 조회
 */
import { z } from "zod";
import { router } from "../_core/trpc";
import { consultantProcedure } from "../middleware/tenant";
import { writeAuditLog } from "../middleware/audit";
import * as db from "../db";

export const consultationRouter = router({
  list: consultantProcedure.query(async ({ ctx }) => {
    // P-02: consultant는 자신이 담당한 자문이력만, super_admin은 전체
    if (ctx.user.role === 'consultant') {
      return db.getConsultationsByConsultant(ctx.user.id);
    }
    return db.getAllConsultations(ctx.clientFilter);
  }),

  getById: consultantProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return db.getConsultationById(input.id);
    }),

  create: consultantProcedure
    .input(z.object({
      clientId: z.number(),
      consultantId: z.number(),
      title: z.string().min(1),
      description: z.string().optional(),
      consultationType: z.enum(['labor_law', 'payroll', 'hr_policy', 'compliance', 'contract', 'dispute', 'general', 'other']).optional(),
      consultationDate: z.date(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      duration: z.number().optional(),
      status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled']).optional(),
      outcome: z.string().optional(),
      recommendations: z.string().optional(),
      followUpRequired: z.enum(['yes', 'no']).optional(),
      followUpDate: z.date().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const id = await db.createConsultation({
        ...input,
        status: input.status || 'scheduled',
        consultationType: input.consultationType || 'general',
      });
      await writeAuditLog({
        userId: ctx.user.id, clientId: input.clientId,
        action: "create", tableName: "consultations", recordId: id,
        newValue: input,
      });
      return { id, success: true };
    }),

  update: consultantProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      consultationType: z.enum(['labor_law', 'payroll', 'hr_policy', 'compliance', 'contract', 'dispute', 'general', 'other']).optional(),
      consultationDate: z.date().optional(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      duration: z.number().optional(),
      status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled']).optional(),
      outcome: z.string().optional(),
      recommendations: z.string().optional(),
      followUpRequired: z.enum(['yes', 'no']).optional(),
      followUpDate: z.date().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      const oldData = await db.getConsultationById(id);
      await db.updateConsultation(id, data);
      await writeAuditLog({
        userId: ctx.user.id, clientId: null,
        action: "update", tableName: "consultations", recordId: id,
        oldValue: oldData, newValue: data,
      });
      return { success: true };
    }),

  delete: consultantProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const oldData = await db.getConsultationById(input.id);
      await db.deleteConsultation(input.id);
      await writeAuditLog({
        userId: ctx.user.id, clientId: null,
        action: "delete", tableName: "consultations", recordId: input.id,
        oldValue: oldData,
      });
      return { success: true };
    }),
});
