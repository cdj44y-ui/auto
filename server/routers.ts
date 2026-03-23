/**
 * P-03: 기존 monolithic routers.ts → routers/index.ts로 이전 완료
 * 이 파일은 하위 호환성을 위한 re-export 전용
 */
export { appRouter, type AppRouter } from "./routers/index";
