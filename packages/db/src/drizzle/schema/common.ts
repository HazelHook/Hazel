import { BuildColumns, sql } from "drizzle-orm"
import { PgTableExtraConfig, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

export const commonFields = {
	id: serial("id").primaryKey(),
	workspaceId: varchar("workspace_id", { length: 128 }).notNull(),
	publicId: varchar("public_id", { length: 21 }).unique().notNull(),

	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
	deletedAt: timestamp("deleted_at"),
}

export const generatePublicId = (prefix: "src" | "dst" | "con" | "itg" | "sk" | "org" | "mem" | "inv") => {
	return `${prefix}_${nanoid(21 - (prefix.length + 1))}`
}
