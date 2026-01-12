import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  employees, InsertEmployee, Employee,
  payrollRecords, InsertPayrollRecord, PayrollRecord,
  emailLogs, InsertEmailLog
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
