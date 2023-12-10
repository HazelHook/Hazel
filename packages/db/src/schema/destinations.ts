import { relations, type InferInsertModel, type InferSelectModel } from "drizzle-orm"
import { boolean, index, mysqlTable, varchar } from "drizzle-orm/mysql-core"
import { commonFields, nameField, urlField } from "./common"
import { connection } from "./connections"

export const destination = mysqlTable(
	"destinations",
	{
		...commonFields("dst"),
		workspaceId: varchar("workspace_id", { length: 128 }).notNull(),
		// .references(() => organizations.publicId),
		publicId: varchar("public_id", { length: 21 }).unique().notNull(),
		name: nameField,
		key: varchar("key", { length: 256 }).notNull().unique(),
		url: urlField.notNull(),
		websocket_connection: boolean("websocket_connection").default(false).notNull(),
	},
	(table) => ({
		workspaceIdx: index("workspace_idx").on(table.workspaceId),
	}),
)

export const destinationRelations = relations(destination, ({ many, one }) => ({
	connections: many(connection),
}))
