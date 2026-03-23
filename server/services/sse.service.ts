/**
 * P-08: Server-Sent Events (SSE) 서비스
 * 실시간 알림 및 대시보드 갱신
 */

import type { Response } from "express";

// userId → Response[] 매핑
const connections = new Map<number, Response[]>();

/**
 * SSE 연결 등록
 */
export function addConnection(userId: number, res: Response): void {
  const existing = connections.get(userId) || [];
  existing.push(res);
  connections.set(userId, existing);

  // 연결 종료 시 제거
  res.on("close", () => {
    const arr = connections.get(userId);
    if (arr) {
      const idx = arr.indexOf(res);
      if (idx !== -1) arr.splice(idx, 1);
      if (arr.length === 0) connections.delete(userId);
    }
  });
}

/**
 * 특정 사용자에게 이벤트 전송
 */
export function sendToUser(userId: number, event: string, data: unknown): void {
  const arr = connections.get(userId);
  if (!arr) return;
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of arr) {
    try { res.write(payload); } catch { /* 끊어진 연결 무시 */ }
  }
}

/**
 * 특정 고객사 전체에게 전송 (clientId → userId 매핑 필요)
 * 간단 구현: 모든 연결에 clientId 정보를 포함하지 않으므로, 
 * 라우터에서 해당 고객사 userId 목록을 조회 후 sendToUser 반복 호출
 */
export function sendToUsers(userIds: number[], event: string, data: unknown): void {
  for (const uid of userIds) {
    sendToUser(uid, event, data);
  }
}

/**
 * 모든 연결에 브로드캐스트 (관리자 알림 등)
 */
export function broadcast(event: string, data: unknown): void {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  Array.from(connections.values()).forEach(arr => {
    for (const res of arr) {
      try { res.write(payload); } catch { /* ignore */ }
    }
  });
}

/**
 * 연결 수 확인
 */
export function getConnectionCount(): number {
  let count = 0;
  Array.from(connections.values()).forEach(arr => { count += arr.length; });
  return count;
}

// Heartbeat: 30초마다 모든 연결에 ping
setInterval(() => {
  const ping = `:heartbeat ${Date.now()}\n\n`;
  Array.from(connections.values()).forEach(arr => {
    for (const res of arr) {
      try { res.write(ping); } catch { /* ignore */ }
    }
  });
}, 30_000);
