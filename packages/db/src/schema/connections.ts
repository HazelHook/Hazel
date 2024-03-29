import { index, json, integer, pgTable, unique, varchar, pgEnum } from "drizzle-orm/pg-core"
import { commonFields, enabledField, nameField } from "./common"
import { relations } from "drizzle-orm"
import { destination } from "./destinations"
import { source } from "./sources"
import { organizations } from "./organizations"

export const retryTypeEnum = pgEnum("retry_type", ["fixed", "exponential"])

export const connection = pgTable(
	"connections",
	{
		...commonFields("con"),
		workspaceId: varchar("workspace_id", { length: 128 })
			.notNull()
			.references(() => organizations.publicId),
		publicId: varchar("public_id", { length: 21 }).unique().notNull(),
		name: nameField,
		enabled: enabledField,

		sourceId: integer("source_id")
			.notNull()
			.references(() => source.id),
		destinationId: integer("destination_id")
			.notNull()
			.references(() => destination.id),

		delay: integer("delay"),

		retyCount: integer("retry_count").default(5).notNull(),
		retryDelay: integer("retry_delay").default(30000).notNull(),
		retryType: retryTypeEnum("retry_type").default("fixed").notNull(),

		fluxConfig: json("flux_config"),
	},
	(table) => ({
		destinationIdx: index("destionation_idx").on(table.destinationId),
		sourceIdx: index("source_idx").on(table.sourceId),
		unq: unique().on(table.sourceId, table.destinationId),
	}),
)

export const connectionRelations = relations(connection, ({ one }) => ({
	destination: one(destination, {
		fields: [connection.destinationId],
		references: [destination.id],
	}),
	source: one(source, {
		fields: [connection.sourceId],
		references: [source.id],
	}),
}))
