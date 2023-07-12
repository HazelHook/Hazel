DROP TABLE `integrationTools`;--> statement-breakpoint
DROP INDEX `conn_public_id_idx` ON `connections`;--> statement-breakpoint
DROP INDEX `conn_customer_id_idx` ON `connections`;--> statement-breakpoint
DROP INDEX `conn_source_id_idx` ON `connections`;--> statement-breakpoint
DROP INDEX `conn_destination_id_idx` ON `connections`;--> statement-breakpoint
DROP INDEX `dest_public_id_idx` ON `destinations`;--> statement-breakpoint
DROP INDEX `dest_customer_id_idx` ON `destinations`;--> statement-breakpoint
CREATE INDEX `con_public_id_idx` ON `connections` (`public_id`);--> statement-breakpoint
CREATE INDEX `con_customer_id_idx` ON `connections` (`customer_id`);--> statement-breakpoint
CREATE INDEX `con_source_id_idx` ON `connections` (`source_id`);--> statement-breakpoint
CREATE INDEX `con_destination_id_idx` ON `connections` (`destination_id`);--> statement-breakpoint
CREATE INDEX `dst_public_id_idx` ON `destinations` (`public_id`);--> statement-breakpoint
CREATE INDEX `dst_customer_id_idx` ON `destinations` (`customer_id`);