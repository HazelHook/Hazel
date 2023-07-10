import { InferModel, relations } from "drizzle-orm"
import { boolean, index, int, json, text, varchar } from "drizzle-orm/mysql-core"

import { buildMysqlTable } from "./common"

const name = varchar("name", { length: 64 }).notNull()
const url = varchar("url", { length: 128 }).notNull()

export const source = buildMysqlTable(
	"sources",
	{
		name,
		url,
	},
	(table) => ({
		publicIdIndex: index("src_public_id_idx").on(table.publicId),

		customerIdIndex: index("src_customer_id_idx").on(table.customerId),
	}),
)

export const destination = buildMysqlTable(
	"destinations",
	{
		name,
		url,
	},
	(table) => ({
		publicIdIndex: index("dest_public_id_idx").on(table.publicId),

		customerIdIndex: index("dest_customer_id_idx").on(table.customerId),
	}),
)

export const connection = buildMysqlTable(
	"connections",
	{
		name,

		sourceId: int("source_id").notNull(),
		destinationId: int("destination_id").notNull(),

		enabled: boolean("enabled").default(true).notNull(),

		fluxConfig: json("flux_config"),
	},
	(table) => ({
		publicIdIndex: index("conn_public_id_idx").on(table.publicId),

		customerIdIndex: index("conn_customer_id_idx").on(table.customerId),

		sourceIdIndex: index("conn_source_id_idx").on(table.sourceId),
		destinationIndex: index("conn_destination_id_idx").on(table.destinationId),
	}),
)

export const sourceRelations = relations(source, ({ many, one }) => ({
	connections: many(connection),
}))
export const destinationRelations = relations(destination, ({ many, one }) => ({
	connections: many(connection),
}))

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

export type InsertConnection = InferModel<typeof connection, "insert">
export type Connection = InferModel<typeof connection, "select">

export type InsertDestination = InferModel<typeof destination, "insert">
export type Destination = InferModel<typeof destination, "select">

export type InsertSource = InferModel<typeof source, "insert">
export type Source = InferModel<typeof source, "select">
