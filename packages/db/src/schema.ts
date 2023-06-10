import { relations, sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

export const source = sqliteTable("sources", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	publicId: text("public_id").notNull(),
	customerId: text("customerId").notNull(),

	name: text("name").notNull(),
	url: text("url").notNull(),

	connectionId: integer("connection_id").references(() => connection.id),

	createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
})

export const destination = sqliteTable("destionations", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	publicId: text("public_id").notNull(),
	customerId: text("customerId").notNull(),

	name: text("name").notNull(),
	url: text("url").notNull(),

	connectionId: integer("connection_id").references(() => connection.id),

	createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
})

export const connection = sqliteTable("connections", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	publicId: text("public_id").notNull(),
	customerId: text("customerId").notNull(),

	name: text("name").notNull(),
	url: text("url").notNull(),

	// TODO: SOME SETTINGS POINTS AND STUFF

	projectId: integer("project_id").references(() => project.id),

	createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
})

export const connectionRelations = relations(connection, ({ one }) => ({
	destination: one(destination, {
		fields: [connection.id],
		references: [destination.connectionId],
	}),
	source: one(source, {
		fields: [connection.id],
		references: [source.connectionId],
	}),
}))

export const project = sqliteTable("projects", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	publicId: text("public_id").notNull(),
	customerId: text("customerId").notNull(),

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

export const insertSource = createInsertSchema(source)
export const selectSource = createSelectSchema(source)
