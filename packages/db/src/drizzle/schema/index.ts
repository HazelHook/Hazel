import { InferModel, relations } from "drizzle-orm"
import { boolean, index, int, json, text, varchar } from "drizzle-orm/mysql-core"

import { buildMysqlTable } from "./common"

const name = varchar("name", { length: 64 }).notNull()
const url = varchar("url", { length: 128 }).notNull()
const enabled = boolean("enabled").default(true).notNull()

export const source = buildMysqlTable(
	"sources",
	{
		name,
		url,
		enabled,
		integrationId: int("integration_id"),
	},
	(table) => ({
		publicIdIndex: index("src_public_id_idx").on(table.publicId),
		customerIdIndex: index("src_customer_id_idx").on(table.customerId),
	}),
)

export const integration = buildMysqlTable(
	"integrations",
	{
		name,
		config: json("config"),
	},
	(table) => ({
		publicIdIndex: index("itg_public_id_idx").on(table.publicId),
		customerIdIndex: index("itg_customer_id_idx").on(table.customerId),
	}),
)


export const destination = buildMysqlTable(
	"destinations",
	{
		name,
		url,
		enabled,
	},
	(table) => ({
		publicIdIndex: index("dst_public_id_idx").on(table.publicId),
		customerIdIndex: index("dst_customer_id_idx").on(table.customerId),
	}),
)

export const connection = buildMysqlTable(
	"connections",
	{
		name,
		enabled,

		sourceId: int("source_id").notNull(),
		destinationId: int("destination_id").notNull(),

		fluxConfig: json("flux_config"),
	},
	(table) => ({
		publicIdIndex: index("con_public_id_idx").on(table.publicId),

		customerIdIndex: index("con_customer_id_idx").on(table.customerId),

		sourceIdIndex: index("con_source_id_idx").on(table.sourceId),
		destinationIndex: index("con_destination_id_idx").on(table.destinationId),
	}),
)

export const sourceRelations = relations(source, ({ many, one }) => ({
	connections: many(connection),
	integration: one(integration),
}))
export const destinationRelations = relations(destination, ({ many, one }) => ({
	connections: many(connection),
}))
export const integrationRelations = relations(integration, ({ one }) => ({
	source: one(source),
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

export type InsertIntegration = InferModel<typeof integration, "insert">
export type Integration = InferModel<typeof integration, "select">