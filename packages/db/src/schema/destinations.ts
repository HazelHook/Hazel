import { relations } from "drizzle-orm"
import { boolean, index, pgTable, varchar } from "drizzle-orm/pg-core"
import { commonFields, nameField, urlField } from "./common"
import { connection } from "./connections"
import { organizations } from "./organizations"

export const destination = pgTable(
	"destinations",
	{
		...commonFields("dst"),
		workspaceId: varchar("workspace_id", { length: 128 })
			.notNull()
			.references(() => organizations.publicId),
		publicId: varchar("public_id", { length: 21 }).unique().notNull(),
		name: nameField,
		key: varchar("key", { length: 256 }).notNull().unique(),
		url: urlField.notNull(),
		websocket_connection: boolean("websocket_connection").default(false).notNull(),
	},
	(table) => ({}),
)

export const destinationRelations = relations(destination, ({ many, one }) => ({
	connections: many(connection),
}))
