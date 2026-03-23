/**
 * P-03: Client Router — 고객사 관리 CRUD
 * super_admin 전용
 */
import { z } from "zod";
import { router } from "../_core/trpc";
import { tenantAdminProcedure } from "../middleware/tenant";
import { writeAuditLog } from "../middleware/audit";
import * as db from "../db";

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

export const clientRouter = router({
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
});
