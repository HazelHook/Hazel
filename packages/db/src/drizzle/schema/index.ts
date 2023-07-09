import { InferModel, relations } from "drizzle-orm"
import { boolean, int, json, text, varchar } from "drizzle-orm/mysql-core"

import { buildMysqlTable } from "./common"

const name = varchar("name", { length: 64 }).notNull()
const url = varchar("url", { length: 128 }).notNull()

export const source = buildMysqlTable("sources", {
	name,
	url,
})

export const destination = buildMysqlTable("destinations", {
	name,
	url,
})

export const connection = buildMysqlTable("connections", {
	name,

	sourceId: int("destination_id").notNull(),
	destinationId: int("source_id").notNull(),

	enabled: boolean("enabled").default(true).notNull(),

	fluxConfig: json("flux_config"),
})

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
