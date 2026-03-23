import { eq, desc, and, sql, gte, lte, count, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  employees, InsertEmployee, Employee,
  payrollRecords, InsertPayrollRecord, PayrollRecord,
  emailLogs, InsertEmailLog,
  auditLogs, InsertAuditLog, AuditLog,
  clients, InsertClient, Client,
  consultations, InsertConsultation, Consultation,
  attendanceRecords, InsertAttendanceRecord, AttendanceRecord,
  notifications, InsertNotification, Notification,
  privacyConsents, InsertPrivacyConsent, PrivacyConsent,
  webhooks, InsertWebhook, Webhook
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ User Queries ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      // P-01: owner는 super_admin으로 설정
      values.role = 'super_admin';
      updateSet.role = 'super_admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ Employee Queries (P-02: clientId 필터 추가) ============

export async function getAllEmployees(clientId?: number | null): Promise<Employee[]> {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [];
  if (clientId) conditions.push(eq(employees.clientId, clientId));
  
  return db.select().from(employees)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(employees.createdAt));
}

export async function getEmployeeById(id: number): Promise<Employee | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(employees).where(eq(employees.id, id)).limit(1);
  return result[0];
}

export async function createEmployee(data: InsertEmployee): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(employees).values(data);
  return Number(result[0].insertId);
}

export async function createEmployeesBulk(data: InsertEmployee[]): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (data.length === 0) return 0;
  
  await db.insert(employees).values(data);
  return data.length;
}

export async function updateEmployee(id: number, data: Partial<InsertEmployee>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(employees).set(data).where(eq(employees.id, id));
}

export async function deleteEmployee(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(employees).where(eq(employees.id, id));
}

// ============ Payroll Queries (P-02: clientId 필터 추가) ============

export async function getPayrollByPeriod(period: string, clientId?: number | null): Promise<PayrollRecord[]> {
  const db = await getDb();
  if (!db) return [];
  
  if (clientId) {
    // clientId 기반 필터: employees 테이블과 JOIN
    const empIds = await db.select({ id: employees.id }).from(employees)
      .where(eq(employees.clientId, clientId));
    const ids = empIds.map(e => e.id);
    if (ids.length === 0) return [];
    return db.select().from(payrollRecords)
      .where(and(eq(payrollRecords.period, period), inArray(payrollRecords.employeeId, ids)));
  }
  
  return db.select().from(payrollRecords).where(eq(payrollRecords.period, period));
}

export async function getPayrollByEmployee(employeeId: number): Promise<PayrollRecord[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(payrollRecords)
    .where(eq(payrollRecords.employeeId, employeeId))
    .orderBy(desc(payrollRecords.period));
}

export async function createPayrollRecord(data: InsertPayrollRecord): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(payrollRecords).values(data);
  return Number(result[0].insertId);
}

export async function updatePayrollRecord(id: number, data: Partial<InsertPayrollRecord>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(payrollRecords).set(data).where(eq(payrollRecords.id, id));
}

export async function markPayslipSent(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(payrollRecords).set({
    slipSent: true,
    slipSentAt: new Date()
  }).where(eq(payrollRecords.id, id));
}

// ============ Email Log Queries ============

export async function createEmailLog(data: InsertEmailLog): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(emailLogs).values(data);
  return Number(result[0].insertId);
}

export async function updateEmailLogStatus(id: number, status: 'sent' | 'failed', errorMessage?: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(emailLogs).set({
    status,
    errorMessage: errorMessage ?? null,
    sentAt: status === 'sent' ? new Date() : null
  }).where(eq(emailLogs.id, id));
}

export async function getEmailLogsByReference(referenceId: number, emailType: string) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(emailLogs)
    .where(and(
      eq(emailLogs.referenceId, referenceId),
      eq(emailLogs.emailType, emailType as any)
    ));
}

// ============ Client (고객사) Queries ============

export async function getAllClients(): Promise<Client[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(clients).orderBy(desc(clients.createdAt));
}

export async function getClientById(id: number): Promise<Client | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return result[0];
}

export async function createClient(data: InsertClient): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(clients).values(data);
  return Number(result[0].insertId);
}

export async function updateClient(id: number, data: Partial<InsertClient>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(clients).set(data).where(eq(clients.id, id));
}

export async function deleteClient(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(clients).where(eq(clients.id, id));
}

// ============ Consultation (자문이력) Queries (P-02: clientId 필터 추가) ============

export async function getAllConsultations(clientId?: number | null): Promise<Consultation[]> {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [];
  if (clientId) conditions.push(eq(consultations.clientId, clientId));
  
  return db.select().from(consultations)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(consultations.consultationDate));
}

/**
 * P-02: consultant 역할 전용 — 자신이 담당한 고객사의 자문이력만 조회
 */
export async function getConsultationsByConsultant(consultantId: number): Promise<Consultation[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(consultations)
    .where(eq(consultations.consultantId, consultantId))
    .orderBy(desc(consultations.consultationDate));
}

/**
 * P-02: consultant가 담당하는 고객사 ID 목록 조회
 */
export async function getClientIdsByConsultant(consultantId: number): Promise<number[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.selectDistinct({ clientId: consultations.clientId })
    .from(consultations)
    .where(eq(consultations.consultantId, consultantId));
  return rows.map(r => r.clientId);
}

export async function getConsultationById(id: number): Promise<Consultation | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(consultations).where(eq(consultations.id, id)).limit(1);
  return result[0];
}

export async function createConsultation(data: InsertConsultation): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(consultations).values(data);
  return Number(result[0].insertId);
}

export async function updateConsultation(id: number, data: Partial<InsertConsultation>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(consultations).set(data).where(eq(consultations.id, id));
}

export async function deleteConsultation(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(consultations).where(eq(consultations.id, id));
}

// ============ Audit Log Queries (감사 로그) ============

export async function createAuditLog(data: InsertAuditLog): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(auditLogs).values(data);
  return Number(result[0].insertId);
}

export async function getAuditLogs(limit: number = 50, offset: number = 0): Promise<AuditLog[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit).offset(offset);
}

// ============ Attendance (출퇴근) Queries (P-02: clientId 필터 추가) ============

export async function clockIn(userId: number, clientId?: number | null): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const now = Date.now();
  const result = await db.insert(attendanceRecords).values({
    userId,
    clientId: clientId ?? null,
    clockIn: now,
    createdAt: now,
    updatedAt: now,
  });
  return Number(result[0].insertId);
}

export async function clockOut(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const now = Date.now();
  await db.update(attendanceRecords).set({ clockOut: now, updatedAt: now }).where(eq(attendanceRecords.id, id));
}

export async function getTodayAttendance(userId: number): Promise<AttendanceRecord | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const result = await db.select().from(attendanceRecords)
    .where(and(
      eq(attendanceRecords.userId, userId),
      sql`${attendanceRecords.clockIn} >= ${todayStart.getTime()}`
    ))
    .orderBy(desc(attendanceRecords.clockIn))
    .limit(1);
  return result[0];
}

export async function getAttendanceByUser(userId: number, limit: number = 30, clientId?: number | null): Promise<AttendanceRecord[]> {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(attendanceRecords.userId, userId)];
  if (clientId) conditions.push(eq(attendanceRecords.clientId, clientId));
  
  return db.select().from(attendanceRecords)
    .where(and(...conditions))
    .orderBy(desc(attendanceRecords.clockIn))
    .limit(limit);
}

// ============ Notification (알림) Queries ============

export async function createNotification(data: Omit<InsertNotification, 'createdAt'>): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(notifications).values({ ...data, createdAt: Date.now() });
  return Number(result[0].insertId);
}

export async function getNotificationsByUser(userId: number, limit: number = 20): Promise<Notification[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function markNotificationRead(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
}

export async function markAllNotificationsRead(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId));
}

export async function getUnreadNotificationCount(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` }).from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  return result[0]?.count ?? 0;
}

// ============ Privacy Consents (B-1) ============

export async function savePrivacyConsent(data: InsertPrivacyConsent): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(privacyConsents).values(data);
  return Number(result[0].insertId);
}

export async function getPrivacyConsents(userId: string): Promise<PrivacyConsent[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(privacyConsents).where(eq(privacyConsents.userId, userId));
}

// ============ Webhooks (E-1) ============

export async function getActiveWebhooks(clientId: number | null, event: string): Promise<Webhook[]> {
  const db = await getDb();
  if (!db) return [];
  const all = await db.select().from(webhooks).where(eq(webhooks.active, true));
  return all.filter(w => {
    const events = JSON.parse(w.events) as string[];
    return events.includes(event) && (w.clientId === clientId || w.clientId === null);
  });
}

export async function sendWebhook(params: { event: string; timestamp: number; clientId: number | null; data: any }) {
  const hooks = await getActiveWebhooks(params.clientId, params.event);
  for (const hook of hooks) {
    try {
      const body = JSON.stringify(params);
      await fetch(hook.url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Webhook-Secret": hook.secret },
        body,
        signal: AbortSignal.timeout(5000),
      });
    } catch (e) {
      console.error(`[Webhook] Failed to send to ${hook.url}:`, e);
    }
  }
}

// ============ Analytics Queries (A-1, A-2, A-3) — P-02: clientId 필터 적용 ============

export async function getMonthlyAttendanceSummary(year: number, month: number, clientId?: number | null) {
  const db = await getDb();
  if (!db) return { totalDays: 0, avgWorkHours: 0, overtimeHours: 0, lateCount: 0 };
  
  const startOfMonth = new Date(year, month - 1, 1).getTime();
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999).getTime();
  
  const conditions = [
    gte(attendanceRecords.clockIn, startOfMonth),
    lte(attendanceRecords.clockIn, endOfMonth),
  ];
  if (clientId) conditions.push(eq(attendanceRecords.clientId, clientId));
  
  const records = await db.select().from(attendanceRecords).where(and(...conditions));
  
  const completedRecords = records.filter(r => r.clockOut);
  const totalWorkMs = completedRecords.reduce((sum, r) => sum + ((r.clockOut ?? 0) - r.clockIn), 0);
  const avgWorkHours = completedRecords.length > 0 ? (totalWorkMs / completedRecords.length / 3600000) : 0;
  
  // 근기법 제50조: 1일 8시간 초과 = 연장근로
  const overtimeMs = completedRecords.reduce((sum, r) => {
    const workMs = (r.clockOut ?? 0) - r.clockIn - 3600000; // 1시간 휴게 제외
    return sum + Math.max(0, workMs - 8 * 3600000);
  }, 0);
  
  return {
    totalDays: records.length,
    avgWorkHours: Math.round(avgWorkHours * 10) / 10,
    overtimeHours: Math.round(overtimeMs / 3600000 * 10) / 10,
    lateCount: 0, // 09:00 기준 지각 카운트는 설정에 따라 다름
  };
}

// A-2: 주 52시간 모니터링 (근기법 제53조 제1항)
export async function getWeeklyOvertimeAlerts(clientId?: number | null) {
  const db = await getDb();
  if (!db) return [];
  
  // 이번 주 월요일 00:00
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);
  
  const conditions = [gte(attendanceRecords.clockIn, monday.getTime())];
  if (clientId) conditions.push(eq(attendanceRecords.clientId, clientId));
  
  const records = await db.select().from(attendanceRecords).where(and(...conditions));
  
  // 사용자별 주간 근무시간 집계
  const userHours: { [key: number]: number } = {};
  for (const r of records) {
    if (!r.clockOut) continue;
    const workHours = (r.clockOut - r.clockIn - 3600000) / 3600000; // 휴게 1시간 제외
    userHours[r.userId] = (userHours[r.userId] ?? 0) + Math.max(0, workHours);
  }
  
  return Object.entries(userHours)
    .filter(([_, hours]) => hours > 40) // 40시간 초과 시 알림
    .map(([userId, hours]) => ({
      userId: Number(userId),
      weeklyHours: Math.round(hours * 10) / 10,
      // 근기법 제53조: 52시간 초과 = 위반
      status: hours > 52 ? "violation" as const : hours > 48 ? "warning" as const : "caution" as const,
      remainingHours: Math.max(0, Math.round((52 - hours) * 10) / 10),
    }));
}

// A-3: 이상 징후 탐지
export async function detectAnomalies(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const twoWeeksAgo = Date.now() - 14 * 24 * 3600000;
  const records = await db.select().from(attendanceRecords)
    .where(and(eq(attendanceRecords.userId, userId), gte(attendanceRecords.clockIn, twoWeeksAgo)))
    .orderBy(desc(attendanceRecords.clockIn));
  
  const anomalies: { type: string; severity: string; description: string }[] = [];
  
  // 패턴 1: 지각 급증 (09:00 이후 출근 5회 이상)
  const lateCount = records.filter(r => {
    const d = new Date(r.clockIn);
    return d.getHours() >= 9 && d.getMinutes() > 0;
  }).length;
  if (lateCount >= 5) anomalies.push({ type: "late_surge", severity: "warning", description: `최근 2주간 지각 ${lateCount}회 감지` });
  
  // 패턴 2: 장시간 근로 (1일 14시간 초과, 근기법 제50조 제2항)
  const longDays = records.filter(r => r.clockOut && (r.clockOut - r.clockIn) > 14 * 3600000);
  if (longDays.length > 0) anomalies.push({ type: "overwork", severity: "critical", description: `1일 14시간 초과 근무 ${longDays.length}건 (근기법 §50②)` });
  
  // 패턴 3: 연속 근무 (12일 이상, 근기법 제55조 제1항)
  if (records.length >= 12) {
    const dates = Array.from(new Set(records.map(r => new Date(r.clockIn).toDateString())));
    if (dates.length >= 12) anomalies.push({ type: "consecutive_work", severity: "critical", description: `12일 이상 연속 근무 감지 (근기법 §55①)` });
  }
  
  return anomalies;
}

// ============ Data Retention (B-2) ============

export async function getExpiredRecords() {
  const db = await getDb();
  if (!db) return { employees: 0, attendance: 0 };
  
  const now = Date.now();
  const expiredEmps = await db.select({ count: sql<number>`count(*)` }).from(employees)
    .where(and(sql`${employees.retentionExpiry} IS NOT NULL`, lte(employees.retentionExpiry, now)));
  const expiredAtt = await db.select({ count: sql<number>`count(*)` }).from(attendanceRecords)
    .where(and(sql`${attendanceRecords.retentionExpiry} IS NOT NULL`, lte(attendanceRecords.retentionExpiry, now)));
  
  return {
    employees: expiredEmps[0]?.count ?? 0,
    attendance: expiredAtt[0]?.count ?? 0,
  };
}

// F-1: 고객사 헬스 스코어
export async function getClientHealthScores() {
  const db = await getDb();
  if (!db) return [];
  
  const allClients = await db.select().from(clients);
  const sevenDaysAgo = Date.now() - 7 * 24 * 3600000;
  
  const scores = [];
  for (const client of allClients) {
    // 로그인 활동 (간접: 해당 고객사 출근 기록 수)
    const recentAttendance = await db.select({ count: sql<number>`count(*)` }).from(attendanceRecords)
      .where(and(eq(attendanceRecords.clientId, client.id), gte(attendanceRecords.clockIn, sevenDaysAgo)));
    const loginCount = recentAttendance[0]?.count ?? 0;
    const loginActivity = loginCount >= 5 ? 25 : loginCount >= 3 ? 15 : loginCount >= 1 ? 5 : 0;
    
    // 출근율 (이번 달)
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthAttendance = await db.select({ count: sql<number>`count(*)` }).from(attendanceRecords)
      .where(and(eq(attendanceRecords.clientId, client.id), gte(attendanceRecords.clockIn, monthStart.getTime())));
    const attendanceRate = Math.min(100, (monthAttendance[0]?.count ?? 0) * 5);
    const attendanceScore = attendanceRate >= 90 ? 25 : attendanceRate >= 70 ? 15 : attendanceRate >= 50 ? 5 : 0;
    
    // 기능 사용 (자문 이력 존재 여부)
    const consultCount = await db.select({ count: sql<number>`count(*)` }).from(consultations)
      .where(eq(consultations.clientId, client.id));
    const featureUsage = (consultCount[0]?.count ?? 0) > 0 ? 15 : 5;
    
    // 데이터 최신성
    const lastRecord = await db.select().from(attendanceRecords)
      .where(eq(attendanceRecords.clientId, client.id))
      .orderBy(desc(attendanceRecords.clockIn)).limit(1);
    const daysSinceLastData = lastRecord.length > 0 ? (Date.now() - lastRecord[0].clockIn) / 86400000 : 999;
    const dataFreshness = daysSinceLastData <= 1 ? 25 : daysSinceLastData <= 3 ? 15 : daysSinceLastData <= 7 ? 5 : 0;
    
    const total = loginActivity + attendanceScore + featureUsage + dataFreshness;
    const grade = total >= 80 ? "healthy" as const : total >= 50 ? "at_risk" as const : "critical" as const;
    
    scores.push({
      clientId: client.id,
      companyName: client.companyName,
      score: total,
      grade,
      breakdown: { loginActivity, attendanceScore, featureUsage, dataFreshness },
    });
  }
  
  return scores;
}

// ============ DB Health Check (P-03) ============

export async function checkDbHealth(): Promise<{ connected: boolean; latencyMs: number }> {
  const start = Date.now();
  try {
    const db = await getDb();
    if (!db) return { connected: false, latencyMs: 0 };
    await db.execute(sql`SELECT 1`);
    return { connected: true, latencyMs: Date.now() - start };
  } catch {
    return { connected: false, latencyMs: Date.now() - start };
  }
}
