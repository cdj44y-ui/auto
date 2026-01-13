import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, bigint, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  /** Role for RBAC: admin (full access), hr (employee management), finance (payroll), user (basic) */
  role: mysqlEnum("role", ["user", "admin", "hr", "finance"]).default("user").notNull(),
  /** Department the user belongs to */
  department: varchar("department", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Employee table for storing employee information
 */
export const employees = mysqlTable("employees", {
  id: int("id").autoincrement().primaryKey(),
  /** Employee ID (사번) */
  employeeId: varchar("employeeId", { length: 32 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  department: varchar("department", { length: 64 }).notNull(),
  position: varchar("position", { length: 64 }),
  /** Employment status */
  status: mysqlEnum("status", ["active", "leave", "resigned"]).default("active").notNull(),
  joinDate: timestamp("joinDate"),
  resignDate: timestamp("resignDate"),
  /** Link to user account if exists */
  userId: int("userId"),
  /** Monthly base salary in KRW */
  salary: bigint("salary", { mode: "number" }),
  /** Bank name for salary payment */
  bankName: varchar("bankName", { length: 64 }),
  /** Bank account number */
  bankAccount: varchar("bankAccount", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = typeof employees.$inferInsert;

/**
 * Payroll table for storing monthly payroll records
 */
export const payrollRecords = mysqlTable("payroll_records", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull(),
  /** Year-Month in format YYYYMM */
  period: varchar("period", { length: 6 }).notNull(),
  /** Base salary in KRW */
  baseSalary: bigint("baseSalary", { mode: "number" }).notNull(),
  /** Overtime pay in KRW */
  overtimePay: bigint("overtimePay", { mode: "number" }).default(0),
  /** Bonus in KRW */
  bonus: bigint("bonus", { mode: "number" }).default(0),
  /** Total deductions in KRW */
  deductions: bigint("deductions", { mode: "number" }).default(0),
  /** Net pay (total after deductions) */
  netPay: bigint("netPay", { mode: "number" }).notNull(),
  /** Payslip sent status */
  slipSent: boolean("slipSent").default(false),
  slipSentAt: timestamp("slipSentAt"),
  /** Record status */
  status: mysqlEnum("status", ["draft", "confirmed", "paid"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PayrollRecord = typeof payrollRecords.$inferSelect;
export type InsertPayrollRecord = typeof payrollRecords.$inferInsert;

/**
 * Email log table for tracking sent emails
 */
export const emailLogs = mysqlTable("email_logs", {
  id: int("id").autoincrement().primaryKey(),
  recipientEmail: varchar("recipientEmail", { length: 320 }).notNull(),
  recipientName: varchar("recipientName", { length: 100 }),
  subject: varchar("subject", { length: 500 }).notNull(),
  /** Email type for categorization */
  emailType: mysqlEnum("emailType", ["payslip", "notification", "approval", "other"]).default("other").notNull(),
  /** Reference ID (e.g., payroll record ID) */
  referenceId: int("referenceId"),
  /** Send status */
  status: mysqlEnum("status", ["pending", "sent", "failed"]).default("pending").notNull(),
  errorMessage: text("errorMessage"),
  sentAt: timestamp("sentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailLog = typeof emailLogs.$inferSelect;
export type InsertEmailLog = typeof emailLogs.$inferInsert;


// ============================================
// 멀티테넌트 스키마 (Phase 1)
// ============================================

/**
 * 고객사 (Clients) 테이블 - 멀티테넌트 핵심
 */
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  companyName: varchar("companyName", { length: 200 }).notNull(),
  businessNumber: varchar("businessNumber", { length: 20 }).unique(),
  representativeName: varchar("representativeName", { length: 100 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  contractStartDate: timestamp("contractStartDate"),
  contractEndDate: timestamp("contractEndDate"),
  contractStatus: mysqlEnum("contractStatus", ["active", "pending", "expired", "terminated"]).default("pending").notNull(),
  maxEmployees: int("maxEmployees").default(100),
  isActive: boolean("isActive").default(true).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

/**
 * 자문 이력 (Consultations) 테이블
 */
export const consultations = mysqlTable("consultations", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  consultantId: int("consultantId").notNull(),
  title: varchar("title", { length: 300 }).notNull(),
  description: text("description"),
  consultationType: mysqlEnum("consultationType", ["labor_law", "payroll", "hr_policy", "compliance", "contract", "dispute", "general", "other"]).default("general").notNull(),
  consultationDate: timestamp("consultationDate").notNull(),
  startTime: varchar("startTime", { length: 10 }),
  endTime: varchar("endTime", { length: 10 }),
  duration: int("duration"),
  status: mysqlEnum("status", ["scheduled", "in_progress", "completed", "cancelled", "rescheduled"]).default("scheduled").notNull(),
  outcome: text("outcome"),
  recommendations: text("recommendations"),
  followUpRequired: mysqlEnum("followUpRequired", ["yes", "no"]).default("no"),
  followUpDate: timestamp("followUpDate"),
  attachments: text("attachments"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = typeof consultations.$inferInsert;

/**
 * 5단계 권한 타입 (super_admin, consultant, company_admin, company_hr, employee)
 */
export type UserRole = "super_admin" | "consultant" | "company_admin" | "company_hr" | "employee";
