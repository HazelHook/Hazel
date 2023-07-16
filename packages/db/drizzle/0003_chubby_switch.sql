ALTER TABLE `destinations` RENAME COLUMN `ws_destinations` TO `websocket_connection`;--> statement-breakpoint
ALTER TABLE `destinations` MODIFY COLUMN `websocket_connection` boolean NOT NULL;--> statement-breakpoint
ALTER TABLE `destinations` MODIFY COLUMN `websocket_connection` boolean NOT NULL DEFAULT false;