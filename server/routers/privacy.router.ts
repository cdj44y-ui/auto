/**
 * P-03: Privacy Router — 개인정보 동의/데이터 보존
 */
import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../_core/trpc";
import * as db from "../db";

export const privacyRouter = router({
  saveConsent: protectedProcedure
    .input(z.object({
      consentType: z.enum(['required', 'optional_gps', 'optional_marketing']),
      consentVersion: z.string(),
      agreed: z.boolean(),
    }))
    .mutation(async ({ input, ctx }) => {
      const id = await db.savePrivacyConsent({
        userId: String(ctx.user.id),
        consentType: input.consentType,
        consented: input.agreed,
        consentedAt: Date.now(),
        ipAddress: ctx.req.ip ?? null,
      });
      return { id, success: true };
    }),

  myConsents: protectedProcedure.query(async ({ ctx }) => {
    return db.getPrivacyConsents(String(ctx.user.id));
  }),

  expiredRecords: adminProcedure.query(async () => {
    return db.getExpiredRecords();
  }),
});
