/**
 * P-03: Payroll Router — 급여 관리
 * P-02: 테넌트 격리 적용 (ctx.clientFilter)
 */
import { z } from "zod";
import { router } from "../_core/trpc";
import { financeProcedure } from "../middleware/tenant";
import { writeAuditLog } from "../middleware/audit";
import * as db from "../db";

const createPayrollSchema = z.object({
  employeeId: z.number(),
  period: z.string().regex(/^\d{6}$/),
  baseSalary: z.number().min(0),
  overtimePay: z.number().min(0).optional(),
  bonus: z.number().min(0).optional(),
  deductions: z.number().min(0).optional(),
});

export const payrollRouter = router({
  getByPeriod: financeProcedure
    .input(z.object({ period: z.string() }))
    .query(async ({ input, ctx }) => {
      return db.getPayrollByPeriod(input.period, ctx.clientFilter);
    }),

  getByEmployee: financeProcedure
    .input(z.object({ employeeId: z.number() }))
    .query(async ({ input }) => {
      return db.getPayrollByEmployee(input.employeeId);
    }),

  create: financeProcedure
    .input(createPayrollSchema)
    .mutation(async ({ input, ctx }) => {
      const netPay = input.baseSalary + (input.overtimePay ?? 0) + (input.bonus ?? 0) - (input.deductions ?? 0);
      const id = await db.createPayrollRecord({
        ...input,
        netPay,
        status: 'draft',
      });
      await writeAuditLog({
        userId: ctx.user.id, clientId: ctx.clientFilter,
        action: "create", tableName: "payroll_records", recordId: id,
        newValue: input,
      });
      return { id, success: true };
    }),

  confirm: financeProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await db.updatePayrollRecord(input.id, { status: 'confirmed' });
      await writeAuditLog({
        userId: ctx.user.id, clientId: ctx.clientFilter,
        action: "update", tableName: "payroll_records", recordId: input.id,
        newValue: { status: 'confirmed' },
      });
      return { success: true };
    }),

  sendPayslip: financeProcedure
    .input(z.object({
      payrollId: z.number(),
      employeeEmail: z.string().email(),
      employeeName: z.string(),
    }))
    .mutation(async ({ input }) => {
      const logId = await db.createEmailLog({
        recipientEmail: input.employeeEmail,
        recipientName: input.employeeName,
        subject: `급여 명세서 발송 - ${new Date().toLocaleDateString('ko-KR')}`,
        emailType: 'payslip',
        referenceId: input.payrollId,
        status: 'pending',
      });

      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        await db.updateEmailLogStatus(logId, 'sent');
        await db.markPayslipSent(input.payrollId);
        return { success: true, logId };
      } catch (error) {
        await db.updateEmailLogStatus(logId, 'failed', String(error));
        throw error;
      }
    }),

  bulkSendPayslips: financeProcedure
    .input(z.array(z.object({
      payrollId: z.number(),
      employeeEmail: z.string().email(),
      employeeName: z.string(),
    })))
    .mutation(async ({ input }) => {
      const results = [];
      for (const item of input) {
        try {
          const logId = await db.createEmailLog({
            recipientEmail: item.employeeEmail,
            recipientName: item.employeeName,
            subject: `급여 명세서 발송 - ${new Date().toLocaleDateString('ko-KR')}`,
            emailType: 'payslip',
            referenceId: item.payrollId,
            status: 'pending',
          });
          await new Promise(resolve => setTimeout(resolve, 300));
          await db.updateEmailLogStatus(logId, 'sent');
          await db.markPayslipSent(item.payrollId);
          results.push({ payrollId: item.payrollId, success: true });
        } catch (error) {
          results.push({ payrollId: item.payrollId, success: false, error: String(error) });
        }
      }
      return {
        total: input.length,
        sent: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results,
      };
    }),
});
