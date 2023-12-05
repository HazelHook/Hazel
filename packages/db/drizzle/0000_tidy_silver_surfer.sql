CREATE TABLE `api_keys` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`public_id` varchar(21) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`workspace_id` varchar(128) NOT NULL,
	`owner_id` varchar(128),
	`name` varchar(128),
	`expires` timestamp(3),
	CONSTRAINT `api_keys_id` PRIMARY KEY(`id`),
	CONSTRAINT `api_keys_public_id_unique` UNIQUE(`public_id`)
);
--> statement-breakpoint
CREATE TABLE `connections` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`public_id` varchar(21) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`workspace_id` varchar(128) NOT NULL,
	`name` varchar(64) NOT NULL,
	`enabled` boolean NOT NULL DEFAULT true,
	`source_id` int NOT NULL,
	`destination_id` int NOT NULL,
	`delay` int,
	`retry_count` int,
	`retry_delay` int,
	`retry_type` enum('fixed','exponential'),
	`flux_config` json,
	CONSTRAINT `connections_id` PRIMARY KEY(`id`),
	CONSTRAINT `connections_public_id_unique` UNIQUE(`public_id`),
	CONSTRAINT `connections_source_id_destination_id_unique` UNIQUE(`source_id`,`destination_id`)
);
--> statement-breakpoint
CREATE TABLE `destinations` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`public_id` varchar(21) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`workspace_id` varchar(128) NOT NULL,
	`name` varchar(64) NOT NULL,
	`key` varchar(256) NOT NULL,
	`url` varchar(128) NOT NULL,
	`websocket_connection` boolean NOT NULL DEFAULT false,
	CONSTRAINT `destinations_id` PRIMARY KEY(`id`),
	CONSTRAINT `destinations_public_id_unique` UNIQUE(`public_id`),
	CONSTRAINT `destinations_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `integrations` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`public_id` varchar(21) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`workspace_id` varchar(128) NOT NULL,
	`tool` enum('hmac','basic_auth','api_key','stripe','github','shopify','gitlab','linear','postmark','typeform','mailgun','sendgrid','ayden','jira','svix','clerk','resend') NOT NULL,
	`config` json NOT NULL,
	CONSTRAINT `integrations_id` PRIMARY KEY(`id`),
	CONSTRAINT `integrations_public_id_unique` UNIQUE(`public_id`)
);
--> statement-breakpoint
CREATE TABLE `organization_invites` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`public_id` varchar(21) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`revoked_at` timestamp,
	`email` varchar(128) NOT NULL,
	`role` enum('owner','admin','member') NOT NULL DEFAULT 'member',
	`organization_id` int NOT NULL,
	CONSTRAINT `organization_invites_id` PRIMARY KEY(`id`),
	CONSTRAINT `organization_invites_public_id_unique` UNIQUE(`public_id`),
	CONSTRAINT `email_idx` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `organization_members` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`public_id` varchar(21) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`user_id` varchar(256) NOT NULL,
	`organization_id` int NOT NULL,
	`role` enum('owner','admin','member') NOT NULL DEFAULT 'member',
	CONSTRAINT `organization_members_id` PRIMARY KEY(`id`),
	CONSTRAINT `organization_members_public_id_unique` UNIQUE(`public_id`)
);
--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`public_id` varchar(21) NOT NULL,
	`owner_id` varchar(128) NOT NULL,
	`name` varchar(128) NOT NULL,
	`plan` enum('free','pro','enterprise'),
	`profile_image` varchar(256),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `organizations_id` PRIMARY KEY(`id`),
	CONSTRAINT `organizations_public_id_unique` UNIQUE(`public_id`)
);
--> statement-breakpoint
CREATE TABLE `sources` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`public_id` varchar(21) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`workspace_id` varchar(128) NOT NULL,
	`name` varchar(64) NOT NULL,
	`key` varchar(256) NOT NULL,
	`integration_id` int,
	CONSTRAINT `sources_id` PRIMARY KEY(`id`),
	CONSTRAINT `sources_public_id_unique` UNIQUE(`public_id`),
	CONSTRAINT `sources_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(256) NOT NULL,
	`name` varchar(128),
	`onboarded` boolean NOT NULL DEFAULT false,
	`profile_image` varchar(128),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `workspace_idx` ON `api_keys` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `destionation_idx` ON `connections` (`destination_id`);--> statement-breakpoint
CREATE INDEX `source_idx` ON `connections` (`source_id`);--> statement-breakpoint
CREATE INDEX `workspace_idx` ON `destinations` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `workspace_idx` ON `integrations` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `role_id_idx` ON `organization_members` (`role`);--> statement-breakpoint
CREATE INDEX `workspace_idx` ON `sources` (`workspace_id`);