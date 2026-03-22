import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";

// ============ 테넌트 격리 미들웨어 (프롬프트 1) ============

const tenantProcedure = protectedProcedure.use(({ ctx, next }) => {
  const user = ctx.user;
  if (user.role === 'admin') {
    // super_admin 역할: 전체 접근
    return next({ ctx: { ...ctx, clientFilter: null as number | null } });
  }
  // 일반 사용자: clientId 기반 필터링 (현재 users 테이블에 clientId 없으므로 null 허용)
  return next({ ctx: { ...ctx, clientFilter: null as number | null } });
});

const tenantAdminProcedure = tenantProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
  return next({ ctx });
});

const consultantProcedure = tenantProcedure.use(({ ctx, next }) => {
  if (!['admin'].includes(ctx.user.role))
    throw new TRPCError({ code: 'FORBIDDEN' });
  return next({ ctx });
});

const companyProcedure = tenantProcedure.use(({ ctx, next }) => {
  if (!['admin', 'hr'].includes(ctx.user.role))
    throw new TRPCError({ code: 'FORBIDDEN' });
  return next({ ctx });
});

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

// ============ 감사 로그 함수 (프롬프트 6) ============

async function writeAuditLog(params: {
  userId: number; clientId: number | null;
  action: "create" | "read" | "update" | "delete";
  tableName: string; recordId?: number;
  oldValue?: any; newValue?: any;
  ipAddress?: string;
}) {
  try {
    await db.createAuditLog({
      userId: String(params.userId),
      clientId: params.clientId,
      action: params.action,
      tableName: params.tableName,
      recordId: params.recordId ?? null,
      oldValue: params.oldValue ? JSON.stringify(params.oldValue) : null,
      newValue: params.newValue ? JSON.stringify(params.newValue) : null,
      ipAddress: params.ipAddress ?? null,
      createdAt: Date.now(),
    });
  } catch (e) {
    console.error("[AuditLog] Failed to write:", e);
  }
}

// ============ Input Schemas ============

const createEmployeeSchema = z.object({
  employeeId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  department: z.string().min(1),
  position: z.string().optional(),
  joinDate: z.date().optional(),
  salary: z.number().optional(),
  bankAccount: z.string().optional(),
  bankName: z.string().optional(),
  status: z.enum(['active', 'leave', 'resigned']).optional(),
});

const updateEmployeeSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  department: z.string().min(1).optional(),
  position: z.string().optional(),
  joinDate: z.date().optional(),
  salary: z.number().optional(),
  bankAccount: z.string().optional(),
  bankName: z.string().optional(),
  status: z.enum(['active', 'leave', 'resigned']).optional(),
});

const bulkCreateEmployeesSchema = z.array(createEmployeeSchema);

const createPayrollSchema = z.object({
  employeeId: z.number(),
  period: z.string().regex(/^\d{6}$/),
  baseSalary: z.number().min(0),
  overtimePay: z.number().min(0).optional(),
  bonus: z.number().min(0).optional(),
  deductions: z.number().min(0).optional(),
});

// ============ Client Input Schemas ============

const createClientSchema = z.object({
  companyName: z.string().min(1),
  businessNumber: z.string().optional(),
  representativeName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  contractStartDate: z.date().optional(),
  contractEndDate: z.date().optional(),
  contractStatus: z.enum(['active', 'pending', 'expired', 'terminated']).optional(),
  maxEmployees: z.number().optional(),
  notes: z.string().optional(),
});

const updateClientSchema = z.object({
  id: z.number(),
  companyName: z.string().min(1).optional(),
  businessNumber: z.string().optional(),
  representativeName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  contractStartDate: z.date().optional(),
  contractEndDate: z.date().optional(),
  contractStatus: z.enum(['active', 'pending', 'expired', 'terminated']).optional(),
  maxEmployees: z.number().optional(),
  isActive: z.boolean().optional(),
  notes: z.string().optional(),
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
      .mutation(async ({ input, ctx }) => {
        const id = await db.createEmployee({
          ...input,
          status: 'active',
        });
        await writeAuditLog({
          userId: ctx.user.id, clientId: null,
          action: "create", tableName: "employees", recordId: id,
          newValue: input,
        });
        return { id, success: true };
      }),

    bulkCreate: hrProcedure
      .input(bulkCreateEmployeesSchema)
      .mutation(async ({ input, ctx }) => {
        const employees = input.map(emp => ({
          ...emp,
          status: 'active' as const,
        }));
        const count = await db.createEmployeesBulk(employees);
        await writeAuditLog({
          userId: ctx.user.id, clientId: null,
          action: "create", tableName: "employees",
          newValue: { bulkCount: count },
        });
        return { count, success: true };
      }),

    update: hrProcedure
      .input(updateEmployeeSchema)
      .mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;
        const oldData = await db.getEmployeeById(id);
        await db.updateEmployee(id, data);
        await writeAuditLog({
          userId: ctx.user.id, clientId: null,
          action: "update", tableName: "employees", recordId: id,
          oldValue: oldData, newValue: data,
        });
        return { success: true };
      }),

    delete: hrProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const oldData = await db.getEmployeeById(input.id);
        await db.deleteEmployee(input.id);
        await writeAuditLog({
          userId: ctx.user.id, clientId: null,
          action: "delete", tableName: "employees", recordId: input.id,
          oldValue: oldData,
        });
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
      .mutation(async ({ input, ctx }) => {
        const netPay = input.baseSalary + (input.overtimePay ?? 0) + (input.bonus ?? 0) - (input.deductions ?? 0);
        const id = await db.createPayrollRecord({
          ...input,
          netPay,
          status: 'draft',
        });
        await writeAuditLog({
          userId: ctx.user.id, clientId: null,
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
          userId: ctx.user.id, clientId: null,
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

  // ============ Consultation Management (Admin Only) — renamed to avoid tRPC collision ============
  consultationMgmt: router({
    list: tenantAdminProcedure.query(async () => {
      return db.getAllConsultations();
    }),
    getById: tenantAdminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getConsultationById(input.id);
    }),
    create: tenantAdminProcedure.input(z.object({
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
    })).mutation(async ({ input, ctx }) => {
      const id = await db.createConsultation({ ...input, status: input.status || 'scheduled', consultationType: input.consultationType || 'general' });
      await writeAuditLog({
        userId: ctx.user.id, clientId: input.clientId,
        action: "create", tableName: "consultations", recordId: id,
        newValue: input,
      });
      return { id, success: true };
    }),
    update: tenantAdminProcedure.input(z.object({
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
    })).mutation(async ({ input, ctx }) => {
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
    delete: tenantAdminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => {
      const oldData = await db.getConsultationById(input.id);
      await db.deleteConsultation(input.id);
      await writeAuditLog({
        userId: ctx.user.id, clientId: null,
        action: "delete", tableName: "consultations", recordId: input.id,
        oldValue: oldData,
      });
      return { success: true };
    }),
  }),

  // ============ Client Management (Admin Only) — renamed to avoid tRPC collision ============
  clientMgmt: router({
    list: tenantAdminProcedure.query(async () => {
      return db.getAllClients();
    }),

    getById: tenantAdminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getClientById(input.id);
      }),

    create: tenantAdminProcedure
      .input(createClientSchema)
      .mutation(async ({ input, ctx }) => {
        const id = await db.createClient({
          ...input,
          contractStatus: input.contractStatus || 'pending',
          isActive: true,
        });
        await writeAuditLog({
          userId: ctx.user.id, clientId: id,
          action: "create", tableName: "clients", recordId: id,
          newValue: input,
        });
        return { id, success: true };
      }),

    update: tenantAdminProcedure
      .input(updateClientSchema)
      .mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;
        const oldData = await db.getClientById(id);
        await db.updateClient(id, data);
        await writeAuditLog({
          userId: ctx.user.id, clientId: id,
          action: "update", tableName: "clients", recordId: id,
          oldValue: oldData, newValue: data,
        });
        return { success: true };
      }),

    delete: tenantAdminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const oldData = await db.getClientById(input.id);
        await db.deleteClient(input.id);
        await writeAuditLog({
          userId: ctx.user.id, clientId: input.id,
          action: "delete", tableName: "clients", recordId: input.id,
          oldValue: oldData,
        });
        return { success: true };
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

  // ============ Audit Log Viewer (Admin Only) ============
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
});

export type AppRouter = typeof appRouter;
