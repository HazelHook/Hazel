import { InferModel, relations, sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

export const source = sqliteTable("sources", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	publicId: text("public_id").notNull(),
	customerId: text("customer_id").notNull(),

	name: text("name").notNull(),
	url: text("url").notNull(),

	createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
})

export const destination = sqliteTable("destinations", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	publicId: text("public_id").notNull(),
	customerId: text("customer_id").notNull(),

	name: text("name").notNull(),
	url: text("url").notNull(),

	createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
})

export const connection = sqliteTable("connections", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	publicId: text("public_id").notNull(),
	customerId: text("customer_id").notNull(),

	name: text("name").notNull(),

	sourceId: integer("destination_id").references(() => source.id),
	destinationId: integer("source_id").references(() => destination.id),

	// The transformer config.
	// TODO: Minify
	fluxConfig: text("flux_config").notNull(),

	projectId: integer("project_id").references(() => project.id),

	createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
})

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

export const project = sqliteTable("projects", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	publicId: text("public_id").notNull(),
	customerId: text("customer_id").notNull(),

	name: text("name").notNull(),

	// TODO: SOME SETTINGS POINTS AND STUFF

	// Should be unique aswell
	slug: text("name").notNull(),

	createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
})

// export const connectionProject = sqliteTable(
// 	"connections",
// 	{
// 		projectId: integer("project_id").references(() => project.id),
// 		connectionId: integer("connection_id").references(() => connection.id),
// 	},
// 	(table) => {
// 		return {
// 			pk: primaryKey(table.projectId, table.connectionId),
// 		}
// 	},
// )

export type InsertConnection = InferModel<typeof connection, "insert">
export type SelectConnection = InferModel<typeof connection, "select">

export type InsertDestination = InferModel<typeof destination, "insert">
export type SelectDestination = InferModel<typeof destination, "select">

export type InsertSource = InferModel<typeof source, "insert">
export type SelectSource = InferModel<typeof source, "select">

export type InsertProject = InferModel<typeof project, "insert">
export type SelectProject = InferModel<typeof project, "select">

// export const insertConnectionProject = createInsertSchema(connectionProject)
// export const selectConnectionProject = createSelectSchema(connectionProject)
