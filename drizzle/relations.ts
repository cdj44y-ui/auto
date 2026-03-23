import { relations } from "drizzle-orm";
import { users, clients, employees, consultations, attendanceRecords } from "./schema";

/** P-01: users → clients 관계 (users.clientId → clients.id) */
export const usersRelations = relations(users, ({ one }) => ({
  client: one(clients, { fields: [users.clientId], references: [clients.id] }),
}));

/** employees → clients 관계 */
export const employeesRelations = relations(employees, ({ one }) => ({
  client: one(clients, { fields: [employees.clientId], references: [clients.id] }),
}));

/** clients → users/employees/consultations 역관계 */
export const clientsRelations = relations(clients, ({ many }) => ({
  users: many(users),
  employees: many(employees),
  consultations: many(consultations),
}));

/** consultations → clients 관계 */
export const consultationsRelations = relations(consultations, ({ one }) => ({
  client: one(clients, { fields: [consultations.clientId], references: [clients.id] }),
}));

/** attendanceRecords → users 관계 */
export const attendanceRelations = relations(attendanceRecords, ({ one }) => ({
  user: one(users, { fields: [attendanceRecords.userId], references: [users.id] }),
}));
