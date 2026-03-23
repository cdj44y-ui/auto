/**
 * P-02: 테넌트 격리 미들웨어
 * users.clientId 기반으로 실제 데이터 격리를 구현
 */
import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../_core/trpc";
import { ROLE_HIERARCHY } from "@shared/types";

/**
 * 테넌트 격리 프로시저
 * - super_admin: clientFilter = null (전체 접근)
 * - consultant: clientFilter = null (자문 대상 고객사는 별도 필터)
 * - company_admin/company_hr/company_finance: clientFilter = user.clientId (자사만)
 * - employee: clientFilter = user.clientId (자사만)
 */
export const tenantProcedure = protectedProcedure.use(({ ctx, next }) => {
  const user = ctx.user;
  const role = user.role;

  // super_admin, consultant: 전체 접근 (consultant는 라우터 레벨에서 추가 필터)
  if (role === 'super_admin' || role === 'consultant') {
    return next({ ctx: { ...ctx, clientFilter: null as number | null } });
  }

  // company_admin, company_hr, company_finance, employee: 자사 clientId 필수
  const clientId = user.clientId;
  if (!clientId) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: '소속 고객사가 지정되지 않았습니다. 관리자에게 문의하세요.',
    });
  }

  return next({ ctx: { ...ctx, clientFilter: clientId as number | null } });
});

/**
 * super_admin 전용 테넌트 프로시저
 */
export const tenantAdminProcedure = tenantProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'super_admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: '최고관리자 권한이 필요합니다.' });
  }
  return next({ ctx });
});

/**
 * consultant 이상 접근 가능한 프로시저
 */
export const consultantProcedure = tenantProcedure.use(({ ctx, next }) => {
  const level = ROLE_HIERARCHY[ctx.user.role] ?? 0;
  if (level < ROLE_HIERARCHY['consultant']) {
    throw new TRPCError({ code: 'FORBIDDEN', message: '자문사 이상 권한이 필요합니다.' });
  }
  return next({ ctx });
});

/**
 * company_admin 이상 접근 가능한 프로시저
 */
export const companyAdminProcedure = tenantProcedure.use(({ ctx, next }) => {
  const level = ROLE_HIERARCHY[ctx.user.role] ?? 0;
  if (level < ROLE_HIERARCHY['company_admin']) {
    throw new TRPCError({ code: 'FORBIDDEN', message: '회사 관리자 이상 권한이 필요합니다.' });
  }
  return next({ ctx });
});

/**
 * company_hr 이상 접근 가능한 프로시저 (직원 관리)
 */
export const hrProcedure = tenantProcedure.use(({ ctx, next }) => {
  const level = ROLE_HIERARCHY[ctx.user.role] ?? 0;
  if (level < ROLE_HIERARCHY['company_hr']) {
    throw new TRPCError({ code: 'FORBIDDEN', message: '인사 관리 권한이 필요합니다.' });
  }
  return next({ ctx });
});

/**
 * company_finance 이상 접근 가능한 프로시저 (급여 관리)
 */
export const financeProcedure = tenantProcedure.use(({ ctx, next }) => {
  const level = ROLE_HIERARCHY[ctx.user.role] ?? 0;
  if (level < ROLE_HIERARCHY['company_finance']) {
    throw new TRPCError({ code: 'FORBIDDEN', message: '급여 관리 권한이 필요합니다.' });
  }
  return next({ ctx });
});
