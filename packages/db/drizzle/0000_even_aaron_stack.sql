CREATE TABLE `connections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`public_id` text DEFAULT ('fyib2lxxcxdQY-QYDrdJ2') NOT NULL,
	`external_id` text NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`source_id` integer,
	`destionation_id` integer,
	`project_id` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`),
	FOREIGN KEY (`destionation_id`) REFERENCES `destionations`(`id`),
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`)
);

CREATE TABLE `destionations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`public_id` text DEFAULT ('e5GFwLWxcck5eDH8gU87R') NOT NULL,
	`external_id` text NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`public_id` text DEFAULT ('9Y0cxD5PD-fcXc4Yn3GtP') NOT NULL,
	`external_id` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE `sources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`public_id` text DEFAULT ('-6Ms36K67LzLaCtU0lp3U') NOT NULL,
	`external_id` text NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
