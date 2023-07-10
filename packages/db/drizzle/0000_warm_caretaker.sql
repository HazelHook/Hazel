CREATE TABLE `connections` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`customer_id` varchar(128) NOT NULL,
	`public_id` varchar(21) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`name` varchar(64) NOT NULL,
	`destination_id` int NOT NULL,
	`source_id` int NOT NULL,
	`enabled` boolean NOT NULL DEFAULT true,
	`flux_config` json);
--> statement-breakpoint
CREATE TABLE `destinations` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`customer_id` varchar(128) NOT NULL,
	`public_id` varchar(21) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`name` varchar(64) NOT NULL,
	`url` varchar(128) NOT NULL);
--> statement-breakpoint
CREATE TABLE `sources` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`customer_id` varchar(128) NOT NULL,
	`public_id` varchar(21) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`name` varchar(64) NOT NULL,
	`url` varchar(128) NOT NULL);
--> statement-breakpoint
CREATE INDEX `conn_public_id_idx` ON `connections` (`public_id`);--> statement-breakpoint
CREATE INDEX `conn_customer_id_idx` ON `connections` (`customer_id`);--> statement-breakpoint
CREATE INDEX `conn_source_id_idx` ON `connections` (`destination_id`);--> statement-breakpoint
CREATE INDEX `conn_destination_id_idx` ON `connections` (`source_id`);--> statement-breakpoint
CREATE INDEX `dest_public_id_idx` ON `destinations` (`public_id`);--> statement-breakpoint
CREATE INDEX `dest_customer_id_idx` ON `destinations` (`customer_id`);--> statement-breakpoint
CREATE INDEX `src_public_id_idx` ON `sources` (`public_id`);--> statement-breakpoint
CREATE INDEX `src_customer_id_idx` ON `sources` (`customer_id`);