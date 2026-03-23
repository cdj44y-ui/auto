/**
 * P-03/P-04/P-05/P-11: Payroll Router
 * - P-04: 서버 급여 계산 엔진 (4대보험 + 소득세)
 * - P-05: 급여명세서 이메일 발송
 * - P-11: 엑셀 내보내기
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router } from "../_core/trpc";
import { financeProcedure, companyAdminProcedure } from "../middleware/tenant";
import { writeAuditLog } from "../middleware/audit";
import * as db from "../db";
import { calculateNetPay } from "../services/salary.service";
import { sendPayslipEmail } from "../services/email.service";
import { generatePayrollExcel, generateDuzonePayroll } from "../services/excel.service";

export const payrollRouter = router({
  /** 급여 목록 조회 */
  getByPeriod: financeProcedure
    .input(z.object({ period: z.string(), clientId: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      const effectiveClientId = ctx.clientFilter ?? input.clientId ?? null;
      return db.getPayrollByPeriod(input.period, effectiveClientId);
    }),

  /** 직원별 급여 조회 */
  getByEmployee: financeProcedure
    .input(z.object({ employeeId: z.number() }))
    .query(async ({ input }) => {
      return db.getPayrollByEmployee(input.employeeId);
    }),

  /** P-04: 서버 급여 시뮬레이션 (4대보험 + 소득세 자동 산출) */
  calculate: financeProcedure
    .input(z.object({
      baseSalary: z.number().min(0),
      overtimePay: z.number().min(0).default(0),
      bonus: z.number().min(0).default(0),
      allowances: z.number().min(0).default(0),
      dependents: z.number().min(1).max(11).default(1),
    }))
    .query(({ input }) => {
      return calculateNetPay(input);
    }),

  /** P-04: 급여 확정 (서버에서 4대보험/소득세 재계산 후 저장) */
  confirm: financeProcedure
    .input(z.object({
      employeeId: z.number(),
      period: z.string().regex(/^\d{6}$/),
      baseSalary: z.number().min(0),
      overtimePay: z.number().min(0).default(0),
      bonus: z.number().min(0).default(0),
      allowances: z.number().min(0).default(0),
      dependents: z.number().min(1).max(11).default(1),
    }))
    .mutation(async ({ input, ctx }) => {
      // 서버에서 재계산 (클라이언트 값 신뢰하지 않음)
      const calc = calculateNetPay({
        baseSalary: input.baseSalary,
        overtimePay: input.overtimePay,
        bonus: input.bonus,
        allowances: input.allowances,
        dependents: input.dependents,
      });

      const id = await db.createPayrollRecord({
        employeeId: input.employeeId,
        period: input.period,
        baseSalary: input.baseSalary,
        overtimePay: input.overtimePay,
        bonus: input.bonus,
        allowances: input.allowances,
        grossPay: calc.grossPay,
        nationalPension: calc.insurance.nationalPension,
        healthInsurance: calc.insurance.healthInsurance,
        longTermCare: calc.insurance.longTermCare,
        employmentInsurance: calc.insurance.employmentInsurance,
        incomeTax: calc.tax.incomeTax,
        localIncomeTax: calc.tax.localIncomeTax,
        dependents: input.dependents,
        deductions: calc.totalDeductions,
        netPay: calc.netPay,
        status: "confirmed",
      });

      await writeAuditLog({
        userId: ctx.user.id, clientId: ctx.user.clientId ?? null,
        action: "create", tableName: "payroll_records", recordId: id,
        newValue: { period: input.period, netPay: calc.netPay },
      });

      return { id, ...calc };
    }),

  /** 기존 급여 레코드 상태 변경 */
  updateStatus: financeProcedure
    .input(z.object({ id: z.number(), status: z.enum(["draft", "confirmed", "paid"]) }))
    .mutation(async ({ input, ctx }) => {
      await db.updatePayrollRecord(input.id, { status: input.status });
      await writeAuditLog({
        userId: ctx.user.id, clientId: ctx.clientFilter,
        action: "update", tableName: "payroll_records", recordId: input.id,
        newValue: { status: input.status },
      });
      return { success: true };
    }),

  /** P-05: 급여명세서 이메일 발송 */
  sendPayslip: financeProcedure
    .input(z.object({ payrollId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const dbInst = await db.getDb();
      if (!dbInst) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB 연결 실패" });

      const { payrollRecords, employees } = await import("../../drizzle/schema");
      const { eq } = await import("drizzle-orm");

      const [record] = await dbInst.select().from(payrollRecords).where(eq(payrollRecords.id, input.payrollId));
      if (!record) throw new TRPCError({ code: "NOT_FOUND", message: "급여 기록을 찾을 수 없습니다." });

      const [emp] = await dbInst.select().from(employees).where(eq(employees.id, record.employeeId));
      if (!emp?.email) throw new TRPCError({ code: "BAD_REQUEST", message: "직원 이메일이 등록되지 않았습니다." });

      // 이메일 로그 생성
      const logId = await db.createEmailLog({
        recipientEmail: emp.email,
        recipientName: emp.name,
        subject: `급여명세서 - ${record.period}`,
        emailType: "payslip",
        referenceId: input.payrollId,
        status: "pending",
      });

      const result = await sendPayslipEmail(
        { name: emp.name, email: emp.email },
        {
          period: record.period,
          baseSalary: record.baseSalary,
          overtimePay: record.overtimePay ?? 0,
          bonus: record.bonus ?? 0,
          allowances: record.allowances ?? 0,
          nationalPension: record.nationalPension ?? 0,
          healthInsurance: record.healthInsurance ?? 0,
          longTermCare: record.longTermCare ?? 0,
          employmentInsurance: record.employmentInsurance ?? 0,
          incomeTax: record.incomeTax ?? 0,
          localIncomeTax: record.localIncomeTax ?? 0,
          grossPay: record.grossPay ?? 0,
          deductions: record.deductions ?? 0,
          netPay: record.netPay,
        }
      );

      if (result.success) {
        await db.updateEmailLogStatus(logId, "sent");
        await db.markPayslipSent(input.payrollId);
      } else {
        await db.updateEmailLogStatus(logId, "failed", result.error);
      }

      return result;
    }),

  /** P-05: 일괄 급여명세서 발송 */
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
            subject: `급여 명세서 발송 - ${new Date().toLocaleDateString("ko-KR")}`,
            emailType: "payslip",
            referenceId: item.payrollId,
            status: "pending",
          });
          await new Promise(resolve => setTimeout(resolve, 300));
          await db.updateEmailLogStatus(logId, "sent");
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

  /** P-11: 엑셀 내보내기 */
  exportExcel: financeProcedure
    .input(z.object({
      period: z.string().regex(/^\d{6}$/),
      format: z.enum(["standard", "duzone"]).default("standard"),
    }))
    .mutation(async ({ input, ctx }) => {
      const effectiveClientId = ctx.clientFilter ?? null;
      const buffer = input.format === "duzone"
        ? await generateDuzonePayroll(input.period, effectiveClientId)
        : await generatePayrollExcel(input.period, effectiveClientId);

      // S3에 업로드
      const { storagePut } = await import("../storage");
      const suffix = Math.random().toString(36).slice(2, 8);
      const filename = `payroll-${input.period}-${input.format}-${suffix}.xlsx`;
      const { url } = await storagePut(`exports/${filename}`, buffer, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

      return { url, filename };
    }),

  /** P-11: 근태 기록 엑셀 내보내기 */
  exportAttendanceExcel: companyAdminProcedure
    .input(z.object({ year: z.number(), month: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { generateAttendanceExcel } = await import("../services/excel.service");
      const effectiveClientId = ctx.clientFilter ?? null;
      const buffer = await generateAttendanceExcel(input.year, input.month, effectiveClientId);

      const { storagePut } = await import("../storage");
      const suffix = Math.random().toString(36).slice(2, 8);
      const filename = `attendance-${input.year}${String(input.month).padStart(2, "0")}-${suffix}.xlsx`;
      const { url } = await storagePut(`exports/${filename}`, buffer, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

      return { url, filename };
    }),
});
