CREATE TABLE `audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` varchar(64) NOT NULL,
	`clientId` int,
	`action` enum('create','read','update','delete') NOT NULL,
	`tableName` varchar(64) NOT NULL,
	`recordId` int,
	`oldValue` text,
	`newValue` text,
	`ipAddress` varchar(45),
	`createdAt` bigint NOT NULL,
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `employees` ADD `clientId` int;