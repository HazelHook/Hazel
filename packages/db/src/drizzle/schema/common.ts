import { BuildColumns, sql } from "drizzle-orm"
import { mysqlTable, MySqlTableExtraConfig, serial, timestamp, varchar } from "drizzle-orm/mysql-core"
import { nanoid } from "nanoid"

const commonFields = {
	id: serial("id").primaryKey().autoincrement(),
	workspaceId: varchar("workspace_id", { length: 128 }).notNull(),
	publicId: varchar("public_id", { length: 21 }).unique().notNull(),

	createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull(),
	updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp("deleted_at"),
}

export const buildMysqlTable = <TTableName extends string, TColumnsMap extends Record<string, any>>(
	name: TTableName,
	fields: TColumnsMap,
	extraConfig?: (self: BuildColumns<TTableName, TColumnsMap & typeof commonFields>) => MySqlTableExtraConfig,
) => {
	return mysqlTable(
		name,
		{
			...commonFields,
			...fields,
		},
		extraConfig,
	)
}

export const buildCustomMysqlTable = <TTableName extends string, TColumnsMap extends Record<string, any>>(
	name: TTableName,
	fields: TColumnsMap,
	extraConfig?: (self: BuildColumns<TTableName, TColumnsMap>) => MySqlTableExtraConfig,
) => {
	return mysqlTable(name, fields, extraConfig)
}

export const generatePublicId = (prefix: "src" | "dst" | "con" | "itg" | "sk" | "org" | "mem" | "inv") => {
	return `${prefix}_${nanoid(21 - (prefix.length + 1))}`
}
