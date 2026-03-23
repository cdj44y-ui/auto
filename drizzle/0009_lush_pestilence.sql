CREATE TABLE `refresh_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tokenHash` varchar(255) NOT NULL,
	`expiresAt` bigint NOT NULL,
	`createdAt` bigint NOT NULL,
	`revokedAt` bigint,
	CONSTRAINT `refresh_tokens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `attendance_records` ADD `authMethod` enum('ip','gps','qr','manual') DEFAULT 'ip';--> statement-breakpoint
ALTER TABLE `attendance_records` ADD `latitude` varchar(20);--> statement-breakpoint
ALTER TABLE `attendance_records` ADD `longitude` varchar(20);--> statement-breakpoint
ALTER TABLE `clients` ADD `geofences` text;--> statement-breakpoint
ALTER TABLE `clients` ADD `isUnder5` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `employees` ADD `dependents` int DEFAULT 1;--> statement-breakpoint
ALTER TABLE `payroll_records` ADD `allowances` bigint DEFAULT 0;--> statement-breakpoint
ALTER TABLE `payroll_records` ADD `grossPay` bigint DEFAULT 0;--> statement-breakpoint
ALTER TABLE `payroll_records` ADD `nationalPension` bigint DEFAULT 0;--> statement-breakpoint
ALTER TABLE `payroll_records` ADD `healthInsurance` bigint DEFAULT 0;--> statement-breakpoint
ALTER TABLE `payroll_records` ADD `longTermCare` bigint DEFAULT 0;--> statement-breakpoint
ALTER TABLE `payroll_records` ADD `employmentInsurance` bigint DEFAULT 0;--> statement-breakpoint
ALTER TABLE `payroll_records` ADD `incomeTax` bigint DEFAULT 0;--> statement-breakpoint
ALTER TABLE `payroll_records` ADD `localIncomeTax` bigint DEFAULT 0;--> statement-breakpoint
ALTER TABLE `payroll_records` ADD `dependents` int DEFAULT 1;--> statement-breakpoint
ALTER TABLE `users` ADD `passwordHash` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `previousPasswords` text;--> statement-breakpoint
CREATE INDEX `idx_refresh_tokens_user_id` ON `refresh_tokens` (`userId`);