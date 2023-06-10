ALTER TABLE `connections` RENAME COLUMN `external_id` TO `customerId`;
ALTER TABLE `destionations` RENAME COLUMN `external_id` TO `customerId`;
ALTER TABLE `projects` RENAME COLUMN `external_id` TO `customerId`;
ALTER TABLE `sources` RENAME COLUMN `external_id` TO `customerId`;
/*
 SQLite does not support "Dropping foreign key" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/
ALTER TABLE destionations ADD `connection_id` integer REFERENCES connections(id);
ALTER TABLE sources ADD `connection_id` integer REFERENCES connections(id);
ALTER TABLE `connections` DROP COLUMN `url`;
ALTER TABLE `connections` DROP COLUMN `source_id`;
ALTER TABLE `connections` DROP COLUMN `destionation_id`;