import { InferModel, relations } from "drizzle-orm"

import { INTEGRATIONS } from "../integrations/data"
import { commonFields } from "./common"
import {
	boolean,
	index,
	integer,
	json,
	pgTable,
	serial,
	timestamp,
	unique,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core"

const name = varchar("name", { length: 64 }).notNull()
const url = varchar("url", { length: 128 })
const enabled = boolean("enabled").default(true).notNull()

const role = varchar("role", { enum: ["owner", "admin", "member"] })

export const source = pgTable(
	"sources",
	{
		...commonFields,
		name,
		url,
		integrationId: integer("integration_id"),
	},
	(table) => ({
		publicIdIndex: index("src_public_id_idx").on(table.publicId),
		workspaceIdIndex: index("src_workspace_id_idx").on(table.workspaceId),

		integrationIdIndex: index("src_integration_id_idx").on(table.integrationId),
	}),
)

export const integration = pgTable(
	"integrations",
	{
		...commonFields,
		name,
		tool: varchar("tool", { enum: Object.keys(INTEGRATIONS) as [string, ...string[]] }),
		config: json("config"),
	},
	(table) => ({
		publicIdIndex: index("itg_public_id_idx").on(table.publicId),
		workspaceIdIndex: index("itg_workspace_id_idx").on(table.workspaceId),

		nameIndex: index("itg_name_idx").on(table.name),
	}),
)

export const destination = pgTable(
	"destinations",
	{
		...commonFields,
		name,
		url: url.notNull(),
		websocket_connection: boolean("websocket_connection").default(false).notNull(),
	},
	(table) => ({
		publicIdIndex: index("dst_public_id_idx").on(table.publicId),
		workspaceIdIndex: index("dst_workspace_id_idx").on(table.workspaceId),
	}),
)

export const connection = pgTable(
	"connections",
	{
		...commonFields,
		name,
		enabled,

		sourceId: integer("source_id").notNull(),
		destinationId: integer("destination_id").notNull(),

		delay: integer("delay"),

		retyCount: integer("retry_count"),
		retryDelay: integer("retry_delay"),
		retryType: varchar("retry_type", { enum: ["fixed", "exponential"] }),

		fluxConfig: json("flux_config"),
	},
	(table) => ({
		publicIdIndex: uniqueIndex("con_public_id_idx").on(table.publicId),

		workspaceIdIndex: index("con_workspace_id_idx").on(table.workspaceId),

		sourceIdIndex: index("con_source_id_idx").on(table.sourceId),
		destinationIndex: index("con_destination_id_idx").on(table.destinationId),

		unq: unique().on(table.sourceId, table.destinationId),
	}),
)

export const apiKeys = pgTable(
	"api_keys",
	{
		...commonFields,
		ownerId: varchar("owner_id", { length: 128 }),
		name: varchar("name", { length: 128 }),
		expires: timestamp("expires", { precision: 3 }),
	},
	(table) => ({
		publicIdx: uniqueIndex("api_public_idx").on(table.publicId),
	}),
)

export const organizations = pgTable(
	"organizations",
	{
		id: serial("id").primaryKey(),
		publicId: varchar("public_id", { length: 21 }).unique().notNull(),

		ownerId: varchar("owner_id", { length: 128 }).notNull(),

		name: varchar("name", { length: 128 }).notNull(),
		personal: boolean("personal").default(false).notNull(),

		plan: varchar("plan", { enum: ["free", "pro", "enterprise"] }),

		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
		deletedAt: timestamp("deleted_at"),
	},
	(table) => ({
		publicIdx: uniqueIndex("public_idx").on(table.publicId),
	}),
)

export const organizationMembers = pgTable(
	"organization_members",
	{
		id: serial("id").primaryKey(),
		publicId: varchar("public_id", { length: 21 }).unique().notNull(),

		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
		deletedAt: timestamp("deleted_at"),

		customerId: varchar("customer_id", { length: 128 }).notNull(),
		organizationId: integer("organization_id").notNull(),
		role: role,
	},
	(table) => ({
		publicIdx: uniqueIndex("public_idx").on(table.publicId),
		customerIdx: index("customer_id_idx").on(table.customerId),
		// roleIdx: index("role_id_idx").on(table.role),
		organizationIdx: index("org_id_idx").on(table.organizationId),
	}),
)

export const organizationInvites = pgTable(
	"organization_invites",
	{
		id: serial("id").primaryKey(),
		publicId: varchar("public_id", { length: 21 }).unique().notNull(),

		createdAt: timestamp("created_at").defaultNow().notNull(),
		revokedAt: timestamp("revoked_at"),

		email: varchar("email", { length: 128 }).notNull(),
		role: role,
		organizationId: integer("organization_id").notNull(),
	},
	(table) => ({
		publicIdx: uniqueIndex("public_idx").on(table.publicId),
		emailIdx: uniqueIndex("email_idx").on(table.email),
	}),
)

export const organizationRelations = relations(organizations, ({ many }) => ({
	members: many(organizationMembers),
	invites: many(organizationInvites),
}))

export const organizationMemberRelations = relations(organizationMembers, ({ one }) => ({
	organization: one(organizations, {
		fields: [organizationMembers.organizationId],
		references: [organizations.id],
	}),
}))

export const organizationInviteRelations = relations(organizationInvites, ({ one }) => ({
	organization: one(organizations, {
		fields: [organizationInvites.organizationId],
		references: [organizations.id],
	}),
}))

export const sourceRelations = relations(source, ({ many, one }) => ({
	connections: many(connection),
	integration: one(integration, {
		fields: [source.integrationId],
		references: [integration.id],
	}),
}))
export const destinationRelations = relations(destination, ({ many, one }) => ({
	connections: many(connection),
}))
export const integrationRelations = relations(integration, ({ many }) => ({
	source: many(source),
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

export type InsertApiKey = InferModel<typeof apiKeys, "insert">
export type ApiKey = InferModel<typeof apiKeys, "select">

export type InsertOrganization = InferModel<typeof organizations, "insert">
export type Organization = InferModel<typeof organizations, "select">

export type InsertOrganizationInvite = InferModel<typeof organizationInvites, "insert">
export type OrganizationInvite = InferModel<typeof organizationInvites, "select">

export type InsertOrganizationMember = InferModel<typeof organizationMembers, "insert">
export type OrganizationMember = InferModel<typeof organizationMembers, "select">
