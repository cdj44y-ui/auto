ALTER TABLE `users` ADD `failedLoginAttempts` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `users` ADD `lockedUntil` bigint;--> statement-breakpoint
ALTER TABLE `users` ADD `passwordChangedAt` bigint;