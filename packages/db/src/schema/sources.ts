import { index, integer, pgTable, varchar } from "drizzle-orm/pg-core"
import { commonFields, nameField } from "./common"
import { relations } from "drizzle-orm"
import { connection } from "./connections"
import { integration } from "./integrations"
import { organizations } from "./organizations"

export const source = pgTable(
	"sources",
	{
		...commonFields("src"),
		workspaceId: varchar("workspace_id", { length: 128 })
			.notNull()
			.references(() => organizations.publicId),
		publicId: varchar("public_id", { length: 21 }).unique().notNull(),
		name: nameField,
		key: varchar("key", { length: 256 }).notNull().unique(),
		integrationId: integer("integration_id").references(() => integration.id),
	},
	(table) => ({}),
)

export const sourceRelations = relations(source, ({ many, one }) => ({
	connections: many(connection),
	workspace: one(organizations, {
		fields: [source.workspaceId],
		references: [organizations.publicId],
	}),
	integration: one(integration, {
		fields: [source.integrationId],
		references: [integration.id],
	}),
}))
