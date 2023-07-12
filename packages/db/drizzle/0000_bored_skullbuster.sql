CREATE TABLE `connections` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`customer_id` varchar(128) NOT NULL,
	`public_id` varchar(21) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`name` varchar(64) NOT NULL,
	`enabled` boolean NOT NULL DEFAULT true,
	`source_id` int NOT NULL,
	`destination_id` int NOT NULL,
	`flux_config` json);
--> statement-breakpoint
CREATE TABLE `destinations` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`customer_id` varchar(128) NOT NULL,
	`public_id` varchar(21) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`name` varchar(64) NOT NULL,
	`url` varchar(128) NOT NULL,
	`enabled` boolean NOT NULL DEFAULT true);
--> statement-breakpoint
CREATE TABLE `integrations` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`customer_id` varchar(128) NOT NULL,
	`public_id` varchar(21) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`name` varchar(64) NOT NULL,
	`config` json);
--> statement-breakpoint
CREATE TABLE `integrationTools` (
	`name` varchar(64) NOT NULL,
	`slug` varchar(64) NOT NULL,
	`schema` text NOT NULL,
	`version` int NOT NULL);
--> statement-breakpoint
CREATE TABLE `sources` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`customer_id` varchar(128) NOT NULL,
	`public_id` varchar(21) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`name` varchar(64) NOT NULL,
	`url` varchar(128) NOT NULL,
	`enabled` boolean NOT NULL DEFAULT true,
	`integration_id` int);
--> statement-breakpoint
CREATE INDEX `conn_public_id_idx` ON `connections` (`public_id`);--> statement-breakpoint
CREATE INDEX `conn_customer_id_idx` ON `connections` (`customer_id`);--> statement-breakpoint
CREATE INDEX `conn_source_id_idx` ON `connections` (`source_id`);--> statement-breakpoint
CREATE INDEX `conn_destination_id_idx` ON `connections` (`destination_id`);--> statement-breakpoint
CREATE INDEX `dest_public_id_idx` ON `destinations` (`public_id`);--> statement-breakpoint
CREATE INDEX `dest_customer_id_idx` ON `destinations` (`customer_id`);--> statement-breakpoint
CREATE INDEX `itg_public_id_idx` ON `integrations` (`public_id`);--> statement-breakpoint
CREATE INDEX `itg_customer_id_idx` ON `integrations` (`customer_id`);--> statement-breakpoint
CREATE INDEX `src_public_id_idx` ON `sources` (`public_id`);--> statement-breakpoint
CREATE INDEX `src_customer_id_idx` ON `sources` (`customer_id`);