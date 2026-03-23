/**
 * P-03: 감사 로그 헬퍼 함수
 * 모든 라우터에서 공통으로 사용
 */
import * as db from "../db";

export async function writeAuditLog(params: {
  userId: number;
  clientId: number | null;
  action: "create" | "read" | "update" | "delete";
  tableName: string;
  recordId?: number;
  oldValue?: any;
  newValue?: any;
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
