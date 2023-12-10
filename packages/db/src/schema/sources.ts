import { index, int, mysqlTable, varchar } from "drizzle-orm/mysql-core"
import { commonFields, nameField } from "./common"
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm"
import { connection } from "./connections"
import { integration } from "./integrations"

export const source = mysqlTable(
	"sources",
	{
		...commonFields("src"),
		workspaceId: varchar("workspace_id", { length: 128 }).notNull(),
		// .references(() => organizations.publicId),
		publicId: varchar("public_id", { length: 21 }).unique().notNull(),
		name: nameField,
		key: varchar("key", { length: 256 }).notNull().unique(),
		integrationId: int("integration_id"),
		// .references(() => integration.id),
	},
	(table) => ({
		workspaceIdx: index("workspace_idx").on(table.workspaceId),
	}),
)

export const sourceRelations = relations(source, ({ many, one }) => ({
	connections: many(connection),
	integration: one(integration, {
		fields: [source.integrationId],
		references: [integration.id],
	}),
}))

export type InsertSource = InferInsertModel<typeof source>
export type Source = InferSelectModel<typeof source>
