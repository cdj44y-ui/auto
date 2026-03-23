import { mysqlTable, int, varchar, text, timestamp, boolean, bigint, mysqlEnum, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * P-01: 6단계 권한 체계 통일 + clientId FK 추가
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  /** P-01: 6단계 RBAC — super_admin > consultant > company_admin > company_hr > company_finance > employee */
  role: mysqlEnum("role", ["super_admin", "consultant", "company_admin", "company_hr", "company_finance", "employee"]).default("employee").notNull(),
  /** P-01: 소속 고객사 (멀티테넌트 FK) */
  clientId: int("clientId"),
  department: varchar("department", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  /** 로그인 실패 횟수 */
  failedLoginAttempts: int("failedLoginAttempts").default(0),
  /** 계정 잠금 해제 시간 (Unix ms) */
  lockedUntil: bigint("lockedUntil", { mode: "number" }),
  /** 비밀번호 변경 시간 (Unix ms) */
  passwordChangedAt: bigint("passwordChangedAt", { mode: "number" }),
}, (table) => ({
  clientIdIdx: index("idx_users_client_id").on(table.clientId),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Employee table — C-1 인덱스, B-2 retentionExpiry 추가
 */
export const employees = mysqlTable("employees", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: varchar("employeeId", { length: 32 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  department: varchar("department", { length: 64 }).notNull(),
  position: varchar("position", { length: 64 }),
  status: mysqlEnum("status", ["active", "leave", "resigned"]).default("active").notNull(),
  joinDate: timestamp("joinDate"),
  resignDate: timestamp("resignDate"),
  userId: int("userId"),
  /** 소속 고객사 (멀티테넌트 외래키) */
  clientId: int("clientId"),
  salary: bigint("salary", { mode: "number" }),
  bankName: varchar("bankName", { length: 64 }),
  bankAccount: varchar("bankAccount", { length: 64 }),
  /** B-2: 퇴직일 + 3년 (근로기준법 제42조) */
  retentionExpiry: bigint("retentionExpiry", { mode: "number" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  clientIdIdx: index("idx_employees_client_id").on(table.clientId),
  emailIdx: index("idx_employees_email").on(table.email),
}));

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = typeof employees.$inferInsert;

/**
 * Payroll table
 */
export const payrollRecords = mysqlTable("payroll_records", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull(),
  period: varchar("period", { length: 6 }).notNull(),
  baseSalary: bigint("baseSalary", { mode: "number" }).notNull(),
  overtimePay: bigint("overtimePay", { mode: "number" }).default(0),
  bonus: bigint("bonus", { mode: "number" }).default(0),
  deductions: bigint("deductions", { mode: "number" }).default(0),
  netPay: bigint("netPay", { mode: "number" }).notNull(),
  slipSent: boolean("slipSent").default(false),
  slipSentAt: timestamp("slipSentAt"),
  status: mysqlEnum("status", ["draft", "confirmed", "paid"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PayrollRecord = typeof payrollRecords.$inferSelect;
export type InsertPayrollRecord = typeof payrollRecords.$inferInsert;

/**
 * Email log table
 */
export const emailLogs = mysqlTable("email_logs", {
  id: int("id").autoincrement().primaryKey(),
  recipientEmail: varchar("recipientEmail", { length: 320 }).notNull(),
  recipientName: varchar("recipientName", { length: 100 }),
  subject: varchar("subject", { length: 500 }).notNull(),
  emailType: mysqlEnum("emailType", ["payslip", "notification", "approval", "other"]).default("other").notNull(),
  referenceId: int("referenceId"),
  status: mysqlEnum("status", ["pending", "sent", "failed"]).default("pending").notNull(),
  errorMessage: text("errorMessage"),
  sentAt: timestamp("sentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailLog = typeof emailLogs.$inferSelect;
export type InsertEmailLog = typeof emailLogs.$inferInsert;

// ============================================
// 멀티테넌트 스키마
// ============================================

/**
 * 고객사 (Clients) 테이블
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
 * 자문 이력 (Consultations) 테이블 — C-1 인덱스 추가
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
}, (table) => ({
  clientIdIdx: index("idx_consultations_client_id").on(table.clientId),
  consultantIdIdx: index("idx_consultations_consultant_id").on(table.consultantId),
  dateIdx: index("idx_consultations_date").on(table.consultationDate),
}));

export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = typeof consultations.$inferInsert;

/**
 * P-01: 6단계 권한 타입 (DB enum과 일치)
 */
export type UserRole = "super_admin" | "consultant" | "company_admin" | "company_hr" | "company_finance" | "employee";

/**
 * 감사 로그 (Audit Logs) — C-1 인덱스 추가
 */
export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  clientId: int("clientId"),
  action: mysqlEnum("action", ["create", "read", "update", "delete"]).notNull(),
  tableName: varchar("tableName", { length: 64 }).notNull(),
  recordId: int("recordId"),
  oldValue: text("oldValue"),
  newValue: text("newValue"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: bigint("createdAt", { mode: "number" }).notNull(),
}, (table) => ({
  userIdIdx: index("idx_audit_user_id").on(table.userId),
  createdAtIdx: index("idx_audit_created_at").on(table.createdAt),
}));

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

/**
 * 출퇴근 기록 (Attendance) — C-1 인덱스, B-2 retentionExpiry 추가
 */
export const attendanceRecords = mysqlTable("attendance_records", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  clientId: int("clientId"),
  clockIn: bigint("clockIn", { mode: "number" }).notNull(),
  clockOut: bigint("clockOut", { mode: "number" }),
  /** B-2: 생성일 + 3년 */
  retentionExpiry: bigint("retentionExpiry", { mode: "number" }),
  createdAt: bigint("createdAt", { mode: "number" }).notNull(),
  updatedAt: bigint("updatedAt", { mode: "number" }).notNull(),
}, (table) => ({
  userIdIdx: index("idx_attendance_user_id").on(table.userId),
  clientIdIdx: index("idx_attendance_client_id").on(table.clientId),
  clockInIdx: index("idx_attendance_clock_in").on(table.clockIn),
  userClockIdx: index("idx_attendance_user_clock").on(table.userId, table.clockIn),
}));

export type AttendanceRecord = typeof attendanceRecords.$inferSelect;
export type InsertAttendanceRecord = typeof attendanceRecords.$inferInsert;

/**
 * 알림 (Notifications) 테이블
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message"),
  type: mysqlEnum("type", ["info", "warning", "success", "error"]).default("info").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  link: varchar("link", { length: 500 }),
  createdAt: bigint("createdAt", { mode: "number" }).notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * B-1: 개인정보 동의 (Privacy Consents) 테이블
 */
export const privacyConsents = mysqlTable("privacy_consents", {
  id: int("id").autoincrement().primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  clientId: int("clientId"),
  consentType: mysqlEnum("consentType", ["required", "optional_gps", "optional_marketing"]).notNull(),
  consented: boolean("consented").notNull(),
  consentedAt: bigint("consentedAt", { mode: "number" }).notNull(),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
});

export type PrivacyConsent = typeof privacyConsents.$inferSelect;
export type InsertPrivacyConsent = typeof privacyConsents.$inferInsert;

/**
 * E-1: Webhook 이벤트 시스템 테이블
 */
export const webhooks = mysqlTable("webhooks", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId"),
  url: varchar("url", { length: 500 }).notNull(),
  /** JSON: ["clock_in","clock_out","overtime_alert"] */
  events: text("events").notNull(),
  /** HMAC 서명용 시크릿 */
  secret: varchar("secret", { length: 255 }).notNull(),
  active: boolean("active").default(true),
  createdAt: bigint("createdAt", { mode: "number" }).notNull(),
});

export type Webhook = typeof webhooks.$inferSelect;
export type InsertWebhook = typeof webhooks.$inferInsert;
