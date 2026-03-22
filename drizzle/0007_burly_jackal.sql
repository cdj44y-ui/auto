CREATE TABLE `privacy_consents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` varchar(255) NOT NULL,
	`clientId` int,
	`consentType` enum('required','optional_gps','optional_marketing') NOT NULL,
	`consented` boolean NOT NULL,
	`consentedAt` bigint NOT NULL,
	`ipAddress` varchar(45),
	`userAgent` text,
	CONSTRAINT `privacy_consents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `webhooks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int,
	`url` varchar(500) NOT NULL,
	`events` text NOT NULL,
	`secret` varchar(255) NOT NULL,
	`active` boolean DEFAULT true,
	`createdAt` bigint NOT NULL,
	CONSTRAINT `webhooks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `attendance_records` ADD `retentionExpiry` bigint;--> statement-breakpoint
ALTER TABLE `employees` ADD `retentionExpiry` bigint;--> statement-breakpoint
CREATE INDEX `idx_attendance_user_id` ON `attendance_records` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_attendance_client_id` ON `attendance_records` (`clientId`);--> statement-breakpoint
CREATE INDEX `idx_attendance_clock_in` ON `attendance_records` (`clockIn`);--> statement-breakpoint
CREATE INDEX `idx_attendance_user_clock` ON `attendance_records` (`userId`,`clockIn`);--> statement-breakpoint
CREATE INDEX `idx_audit_user_id` ON `audit_logs` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_audit_created_at` ON `audit_logs` (`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_consultations_client_id` ON `consultations` (`clientId`);--> statement-breakpoint
CREATE INDEX `idx_consultations_consultant_id` ON `consultations` (`consultantId`);--> statement-breakpoint
CREATE INDEX `idx_consultations_date` ON `consultations` (`consultationDate`);--> statement-breakpoint
CREATE INDEX `idx_employees_client_id` ON `employees` (`clientId`);--> statement-breakpoint
CREATE INDEX `idx_employees_email` ON `employees` (`email`);