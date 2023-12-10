import { genId } from "@hazel/utils"
import { sql } from "drizzle-orm"
import { boolean, mysqlEnum, serial, timestamp, varchar } from "drizzle-orm/mysql-core"

export type SchemaType = "src" | "dst" | "con" | "itg" | "sk" | "org" | "mem" | "inv"

export const generatePublicId = (prefix: SchemaType) => {
	return `${prefix}_${genId(21 - (prefix.length + 1))}`
}

export const commonFields = (type: SchemaType) => ({
	id: serial("id").primaryKey(),

	publicId: varchar("public_id", { length: 21 })
		.unique()
		.notNull()
		.$defaultFn(() => generatePublicId(type)),

	createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull(),
})

export const nameField = varchar("name", { length: 64 }).notNull()
export const urlField = varchar("url", { length: 128 })
export const enabledField = boolean("enabled").default(true).notNull()
export const roleField = mysqlEnum("role", ["owner", "admin", "member"]).notNull().default("member")
