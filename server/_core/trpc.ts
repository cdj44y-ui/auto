import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from '@shared/const';
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";
import { ROLE_HIERARCHY } from "@shared/types";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

/**
 * P-01: super_admin 전용 프로시저
 * 기존 adminProcedure를 super_admin 기준으로 변경
 */
export const adminProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== 'super_admin') {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);

/**
 * P-01: 최소 역할 레벨 이상이면 접근 가능한 프로시저 생성 헬퍼
 */
export function createMinRoleProcedure(minRole: string) {
  return t.procedure.use(
    t.middleware(async opts => {
      const { ctx, next } = opts;
      if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
      }
      const userLevel = ROLE_HIERARCHY[ctx.user.role] ?? 0;
      const requiredLevel = ROLE_HIERARCHY[minRole] ?? 999;
      if (userLevel < requiredLevel) {
        throw new TRPCError({ code: "FORBIDDEN", message: `최소 ${minRole} 이상 권한이 필요합니다.` });
      }
      return next({ ctx: { ...ctx, user: ctx.user } });
    }),
  );
}
