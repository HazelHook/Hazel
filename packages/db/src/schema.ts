import { InferModel, relations } from "drizzle-orm"
import { timestamp } from "drizzle-orm/mysql-core"
import { json } from "drizzle-orm/mysql-core"
import { int } from "drizzle-orm/mysql-core"
import { serial } from "drizzle-orm/mysql-core"
import { mysqlTable, text, varchar } from "drizzle-orm/mysql-core"

export const source = mysqlTable(
	"sources",
	{
		id: serial("id").primaryKey().autoincrement(),
		publicId: varchar("public_id", { length: 32 }).notNull(),
		customerId: varchar("customer_id", { length: 128 }).notNull(),

		name: varchar("name", { length: 64 }).notNull(),
		url: varchar("url", { length: 128 }).notNull(),

		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	// (source) => ({
	// 	publicIdIndex: uniqueIndex("src_public_id_idx").on(source.publicId),

	// 	customerIdIndex: index("src_customer_id_idx").on(source.customerId),
	// }),
)

export const sourceRelations = relations(source, ({ many, one }) => ({
	connections: many(connection),
}))

export const destination = mysqlTable(
	"destinations",
	{
		id: serial("id").autoincrement().primaryKey(),
		publicId: varchar("public_id", { length: 32 }).notNull(),
		customerId: varchar("customer_id", { length: 128 }).notNull(),

		name: text("name").notNull(),
		url: text("url").notNull(),

		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
	},
	// (destination) => ({
	// 	publicIdIndex: index("dest_public_id_idx").on(destination.publicId),

	// 	customerIdIndex: index("dest_customer_id_idx").on(destination.customerId),
	// }),
)

export const destinationRelations = relations(destination, ({ many, one }) => ({
	connections: many(connection),
}))

export const connection = mysqlTable(
	"connections",
	{
		id: serial("id").autoincrement().primaryKey(),
		publicId: varchar("public_id", { length: 32 }).notNull(),
		customerId: varchar("customer_id", { length: 128 }).notNull(),

		name: text("name").notNull(),

		sourceId: int("destination_id"),
		destinationId: int("source_id"),

		// The transformer config.
		// TODO: Minify
		fluxConfig: json("flux_config"),

		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),

		// TODO: RULES
	},
	// (connection) => ({
	// 	publicIdIndex: index("conn_public_id_idx").on(connection.publicId),

	// 	customerIdIndex: index("conn_customer_id_idx").on(connection.customerId),

	// 	sourceIdIndex: index("source_id_idx").on(connection.sourceId),
	// 	destinationIndex: index("source_id_idx").on(connection.destinationId),
	// }),
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

export type InsertConnection = InferModel<typeof connection, "insert">
export type Connection = InferModel<typeof connection, "select">

export type InsertDestination = InferModel<typeof destination, "insert">
export type Destination = InferModel<typeof destination, "select">

export type InsertSource = InferModel<typeof source, "insert">
export type Source = InferModel<typeof source, "select">

// export const insertConnectionProject = createInsertSchema(connectionProject)
// export const selectConnectionProject = createSelectSchema(connectionProject)
