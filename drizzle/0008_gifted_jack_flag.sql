-- Role enum already migrated manually
-- ALTER TABLE `users` MODIFY COLUMN `role` enum('super_admin','consultant','company_admin','company_hr','company_finance','employee') NOT NULL DEFAULT 'employee';--> statement-breakpoint
ALTER TABLE `users` ADD `clientId` int;--> statement-breakpoint
CREATE INDEX `idx_users_client_id` ON `users` (`clientId`);