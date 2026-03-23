import { relations } from "drizzle-orm";
import {
  users, employees, clients, consultations, attendanceRecords,
  refreshTokens, webhooks,
} from "./schema";

// Users → Clients (many-to-one)
export const usersRelations = relations(users, ({ one }) => ({
  client: one(clients, { fields: [users.clientId], references: [clients.id] }),
}));

// Clients → Users, Employees, Consultations (one-to-many)
export const clientsRelations = relations(clients, ({ many }) => ({
  users: many(users),
  employees: many(employees),
  consultations: many(consultations),
  attendanceRecords: many(attendanceRecords),
  webhooks: many(webhooks),
}));

// Employees → Clients (many-to-one)
export const employeesRelations = relations(employees, ({ one }) => ({
  client: one(clients, { fields: [employees.clientId], references: [clients.id] }),
  user: one(users, { fields: [employees.userId], references: [users.id] }),
}));

// Consultations → Clients (many-to-one)
export const consultationsRelations = relations(consultations, ({ one }) => ({
  client: one(clients, { fields: [consultations.clientId], references: [clients.id] }),
  consultant: one(users, { fields: [consultations.consultantId], references: [users.id] }),
}));

// AttendanceRecords → Clients, Users (many-to-one)
export const attendanceRelations = relations(attendanceRecords, ({ one }) => ({
  client: one(clients, { fields: [attendanceRecords.clientId], references: [clients.id] }),
  user: one(users, { fields: [attendanceRecords.userId], references: [users.id] }),
}));

// RefreshTokens → Users (many-to-one)
export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, { fields: [refreshTokens.userId], references: [users.id] }),
}));

// Webhooks → Clients (many-to-one)
export const webhooksRelations = relations(webhooks, ({ one }) => ({
  client: one(clients, { fields: [webhooks.clientId], references: [clients.id] }),
}));
