/**
 * P-03: Employee Router — 직원 관리 CRUD
 * P-02: 테넌트 격리 적용 (ctx.clientFilter)
 */
import { z } from "zod";
import { router } from "../_core/trpc";
import { hrProcedure } from "../middleware/tenant";
import { writeAuditLog } from "../middleware/audit";
import * as db from "../db";

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
  clientId: z.number().optional(),
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
  clientId: z.number().optional(),
});

export const employeeRouter = router({
  list: hrProcedure.query(async ({ ctx }) => {
    return db.getAllEmployees(ctx.clientFilter);
  }),

  getById: hrProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return db.getEmployeeById(input.id);
    }),

  create: hrProcedure
    .input(createEmployeeSchema)
    .mutation(async ({ input, ctx }) => {
      // P-02: 테넌트 격리 — clientId 자동 주입
      const data = {
        ...input,
        status: 'active' as const,
        clientId: input.clientId ?? ctx.clientFilter ?? undefined,
      };
      const id = await db.createEmployee(data);
      await writeAuditLog({
        userId: ctx.user.id, clientId: ctx.clientFilter,
        action: "create", tableName: "employees", recordId: id,
        newValue: input,
      });
      return { id, success: true };
    }),

  bulkCreate: hrProcedure
    .input(z.array(createEmployeeSchema))
    .mutation(async ({ input, ctx }) => {
      const employees = input.map(emp => ({
        ...emp,
        status: 'active' as const,
        clientId: emp.clientId ?? ctx.clientFilter ?? undefined,
      }));
      const count = await db.createEmployeesBulk(employees);
      await writeAuditLog({
        userId: ctx.user.id, clientId: ctx.clientFilter,
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
        userId: ctx.user.id, clientId: ctx.clientFilter,
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
        userId: ctx.user.id, clientId: ctx.clientFilter,
        action: "delete", tableName: "employees", recordId: input.id,
        oldValue: oldData,
      });
      return { success: true };
    }),
});
