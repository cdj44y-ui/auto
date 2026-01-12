import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";

// ============ RBAC Middleware ============

// HR role can manage employees
const hrProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user || !['admin', 'hr'].includes(ctx.user.role)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "인사 관리 권한이 필요합니다." });
  }
  return next({ ctx });
});

// Finance role can manage payroll
const financeProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user || !['admin', 'finance'].includes(ctx.user.role)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "급여 관리 권한이 필요합니다." });
  }
  return next({ ctx });
});

// ============ Input Schemas ============

const createEmployeeSchema = z.object({
  employeeId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  department: z.string().min(1),
  position: z.string().optional(),
  joinDate: z.date().optional(),
});

const bulkCreateEmployeesSchema = z.array(createEmployeeSchema);

const createPayrollSchema = z.object({
  employeeId: z.number(),
  period: z.string().regex(/^\d{6}$/), // YYYYMM format
  baseSalary: z.number().min(0),
  overtimePay: z.number().min(0).optional(),
  bonus: z.number().min(0).optional(),
  deductions: z.number().min(0).optional(),
});

// ============ Router Definition ============

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============ Employee Management (HR Role) ============
  employee: router({
    list: hrProcedure.query(async () => {
      return db.getAllEmployees();
    }),

    getById: hrProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getEmployeeById(input.id);
      }),

    create: hrProcedure
      .input(createEmployeeSchema)
      .mutation(async ({ input }) => {
        const id = await db.createEmployee({
          ...input,
          status: 'active',
        });
        return { id, success: true };
      }),

    bulkCreate: hrProcedure
      .input(bulkCreateEmployeesSchema)
      .mutation(async ({ input }) => {
        const employees = input.map(emp => ({
          ...emp,
          status: 'active' as const,
        }));
        const count = await db.createEmployeesBulk(employees);
        return { count, success: true };
      }),

    update: hrProcedure
      .input(z.object({
        id: z.number(),
        data: createEmployeeSchema.partial(),
      }))
      .mutation(async ({ input }) => {
        await db.updateEmployee(input.id, input.data);
        return { success: true };
      }),

    delete: hrProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteEmployee(input.id);
        return { success: true };
      }),
  }),

  // ============ Payroll Management (Finance Role) ============
  payroll: router({
    getByPeriod: financeProcedure
      .input(z.object({ period: z.string() }))
      .query(async ({ input }) => {
        return db.getPayrollByPeriod(input.period);
      }),

    getByEmployee: financeProcedure
      .input(z.object({ employeeId: z.number() }))
      .query(async ({ input }) => {
        return db.getPayrollByEmployee(input.employeeId);
      }),

    create: financeProcedure
      .input(createPayrollSchema)
      .mutation(async ({ input }) => {
        const netPay = input.baseSalary + (input.overtimePay ?? 0) + (input.bonus ?? 0) - (input.deductions ?? 0);
        const id = await db.createPayrollRecord({
          ...input,
          netPay,
          status: 'draft',
        });
        return { id, success: true };
      }),

    confirm: financeProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.updatePayrollRecord(input.id, { status: 'confirmed' });
        return { success: true };
      }),

    sendPayslip: financeProcedure
      .input(z.object({ 
        payrollId: z.number(),
        employeeEmail: z.string().email(),
        employeeName: z.string(),
      }))
      .mutation(async ({ input }) => {
        // Create email log
        const logId = await db.createEmailLog({
          recipientEmail: input.employeeEmail,
          recipientName: input.employeeName,
          subject: `급여 명세서 발송 - ${new Date().toLocaleDateString('ko-KR')}`,
          emailType: 'payslip',
          referenceId: input.payrollId,
          status: 'pending',
        });

        // Simulate email sending (in production, integrate with actual email service)
        try {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Mark as sent
          await db.updateEmailLogStatus(logId, 'sent');
          await db.markPayslipSent(input.payrollId);
          
          return { success: true, logId };
        } catch (error) {
          await db.updateEmailLogStatus(logId, 'failed', String(error));
          throw new TRPCError({ 
            code: 'INTERNAL_SERVER_ERROR', 
            message: '이메일 발송에 실패했습니다.' 
          });
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

            // Simulate email sending
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
          results 
        };
      }),
  }),

  // ============ User Role Management (Admin Only) ============
  admin: router({
    updateUserRole: adminProcedure
      .input(z.object({
        userId: z.number(),
        role: z.enum(['user', 'admin', 'hr', 'finance']),
      }))
      .mutation(async ({ input }) => {
        const db_instance = await db.getDb();
        if (!db_instance) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        
        const { users } = await import('../drizzle/schema');
        const { eq } = await import('drizzle-orm');
        
        await db_instance.update(users)
          .set({ role: input.role })
          .where(eq(users.id, input.userId));
        
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
