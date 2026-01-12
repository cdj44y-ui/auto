CREATE TABLE `email_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recipientEmail` varchar(320) NOT NULL,
	`recipientName` varchar(100),
	`subject` varchar(500) NOT NULL,
	`emailType` enum('payslip','notification','approval','other') NOT NULL DEFAULT 'other',
	`referenceId` int,
	`status` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
	`errorMessage` text,
	`sentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` varchar(32) NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`department` varchar(64) NOT NULL,
	`position` varchar(64),
	`status` enum('active','leave','resigned') NOT NULL DEFAULT 'active',
	`joinDate` timestamp,
	`resignDate` timestamp,
	`userId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employees_id` PRIMARY KEY(`id`),
	CONSTRAINT `employees_employeeId_unique` UNIQUE(`employeeId`)
);
--> statement-breakpoint
CREATE TABLE `payroll_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`period` varchar(6) NOT NULL,
	`baseSalary` bigint NOT NULL,
	`overtimePay` bigint DEFAULT 0,
	`bonus` bigint DEFAULT 0,
	`deductions` bigint DEFAULT 0,
	`netPay` bigint NOT NULL,
	`slipSent` boolean DEFAULT false,
	`slipSentAt` timestamp,
	`status` enum('draft','confirmed','paid') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payroll_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','hr','finance') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `department` varchar(64);