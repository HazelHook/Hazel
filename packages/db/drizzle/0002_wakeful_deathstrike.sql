ALTER TABLE `connections` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `destinations` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `integrations` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `sources` ADD `deleted_at` timestamp;