import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  employees, InsertEmployee, Employee,
  payrollRecords, InsertPayrollRecord, PayrollRecord,
  emailLogs, InsertEmailLog,
  auditLogs, InsertAuditLog, AuditLog
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
      values.role = 'admin';
      updateSet.role = 'admin';
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

// ============ Employee Queries ============

export async function getAllEmployees(): Promise<Employee[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(employees).orderBy(desc(employees.createdAt));
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

// ============ Payroll Queries ============

export async function getPayrollByPeriod(period: string): Promise<PayrollRecord[]> {
  const db = await getDb();
  if (!db) return [];
  
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

import { clients, InsertClient, Client } from "../drizzle/schema";

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


// ============ Consultation (자문이력) Queries ============

import { consultations, InsertConsultation, Consultation } from "../drizzle/schema";

export async function getAllConsultations(): Promise<Consultation[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(consultations).orderBy(desc(consultations.consultationDate));
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

// ============ Attendance (출퇴근) Queries - D-5 ============

import { attendanceRecords, InsertAttendanceRecord, AttendanceRecord } from "../drizzle/schema";

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

export async function getAttendanceByUser(userId: number, limit: number = 30): Promise<AttendanceRecord[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(attendanceRecords)
    .where(eq(attendanceRecords.userId, userId))
    .orderBy(desc(attendanceRecords.clockIn))
    .limit(limit);
}

// ============ Notification (알림) Queries - D-6 ============

import { notifications, InsertNotification, Notification } from "../drizzle/schema";

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
