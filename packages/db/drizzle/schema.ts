import { mysqlTable, mysqlSchema, AnyMySqlColumn, index, serial, varchar, timestamp, int, tinyint, json, text } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const connections = mysqlTable("connections", {
	id: serial("id").primaryKey().notNull(),
	customerId: varchar("customer_id", { length: 128 }).notNull(),
	publicId: varchar("public_id", { length: 21 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	name: varchar("name", { length: 64 }).notNull(),
	destinationId: int("destination_id").notNull(),
	sourceId: int("source_id").notNull(),
	enabled: tinyint("enabled").default(1).notNull(),
	fluxConfig: json("flux_config"),
},
(table) => {
	return {
		connPublicIdIdx: index("conn_public_id_idx").on(table.publicId),
		connCustomerIdIdx: index("conn_customer_id_idx").on(table.customerId),
		connDestinationIdIdx: index("conn_destination_id_idx").on(table.destinationId),
		connSourceIdIdx: index("conn_source_id_idx").on(table.sourceId),
	}
});

export const destinations = mysqlTable("destinations", {
	id: serial("id").primaryKey().notNull(),
	customerId: varchar("customer_id", { length: 128 }).notNull(),
	publicId: varchar("public_id", { length: 21 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	name: varchar("name", { length: 64 }).notNull(),
	url: varchar("url", { length: 128 }).notNull(),
	enabled: tinyint("enabled").default(1).notNull(),
},
(table) => {
	return {
		destPublicIdIdx: index("dest_public_id_idx").on(table.publicId),
		destCustomerIdIdx: index("dest_customer_id_idx").on(table.customerId),
	}
});

export const integrationTools = mysqlTable("integrationTools", {
	name: varchar("name", { length: 64 }).notNull(),
	slug: varchar("slug", { length: 64 }).notNull(),
	version: int("version").notNull(),
	schema: text("schema").notNull(),
});

export const integrations = mysqlTable("integrations", {
	id: serial("id").primaryKey().notNull(),
	customerId: varchar("customer_id", { length: 128 }).notNull(),
	publicId: varchar("public_id", { length: 21 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	name: varchar("name", { length: 64 }).notNull(),
	config: json("config"),
},
(table) => {
	return {
		itgPublicIdIdx: index("itg_public_id_idx").on(table.publicId),
		itgCustomerIdIdx: index("itg_customer_id_idx").on(table.customerId),
	}
});

export const sources = mysqlTable("sources", {
	id: serial("id").primaryKey().notNull(),
	customerId: varchar("customer_id", { length: 128 }).notNull(),
	publicId: varchar("public_id", { length: 21 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	name: varchar("name", { length: 64 }).notNull(),
	url: varchar("url", { length: 128 }).notNull(),
	integrationId: int("integration_id"),
	enabled: tinyint("enabled").default(1).notNull(),
},
(table) => {
	return {
		srcPublicIdIdx: index("src_public_id_idx").on(table.publicId),
		srcCustomerIdIdx: index("src_customer_id_idx").on(table.customerId),
	}
});