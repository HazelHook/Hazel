import { index, int, json, mysqlEnum, mysqlTable, unique, varchar } from "drizzle-orm/mysql-core"
import { commonFields, enabledField, nameField } from "./common"
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm"
import { destination } from "./destinations"
import { source } from "./sources"

export const connection = mysqlTable(
	"connections",
	{
		...commonFields("con"),
		workspaceId: varchar("workspace_id", { length: 128 }).notNull(),
		// .references(() => organizations.publicId),
		publicId: varchar("public_id", { length: 21 }).unique().notNull(),
		name: nameField,
		enabled: enabledField,

		sourceId: int("source_id").notNull(),
		// .references(() => source.id),
		destinationId: int("destination_id").notNull(),
		// .references(() => destination.id),

		delay: int("delay"),

		retyCount: int("retry_count").default(5).notNull(),
		retryDelay: int("retry_delay").default(30000).notNull(),
		retryType: mysqlEnum("retry_type", ["fixed", "exponential"]).default("fixed").notNull(),

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
