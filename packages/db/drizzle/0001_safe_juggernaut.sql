ALTER TABLE `connections` MODIFY COLUMN `retry_count` int NOT NULL DEFAULT 5;--> statement-breakpoint
ALTER TABLE `connections` MODIFY COLUMN `retry_delay` int NOT NULL DEFAULT 30000;--> statement-breakpoint
ALTER TABLE `connections` MODIFY COLUMN `retry_type` enum('fixed','exponential') NOT NULL DEFAULT 'fixed';