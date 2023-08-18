import { InferModel, relations } from "drizzle-orm"

import { INTEGRATIONS } from "../integrations/data"
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
	uuid,
	varchar,
} from "drizzle-orm/pg-core"

const commonFields = {
	id: serial("id").primaryKey(),

	publicId: varchar("public_id", { length: 21 }).unique().notNull(),

	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
	deletedAt: timestamp("deleted_at"),
}

const name = varchar("name", { length: 64 }).notNull()
const url = varchar("url", { length: 128 })
const enabled = boolean("enabled").default(true).notNull()

const role = varchar("role", { enum: ["owner", "admin", "member"] })

export const user = pgTable("users", {
	id: uuid("id").primaryKey().notNull(),
	name: varchar("name", { length: 128 }),
	onboarded: boolean("onboarded").default(false).notNull(),
	profileImage: varchar("profile_image"),
})

export const source = pgTable(
	"sources",
	{
		...commonFields,
		workspaceId: varchar("workspace_id", { length: 128 })
			.notNull()
			.references(() => organizations.publicId),
		publicId: varchar("public_id", { length: 21 }).unique().notNull(),
		name,
		url,
		integrationId: integer("integration_id").references(() => integration.id),
	},
	(table) => ({}),
)

export const integration = pgTable(
	"integrations",
	{
		...commonFields,
		workspaceId: varchar("workspace_id", { length: 128 })
			.notNull()
			.references(() => organizations.publicId),
		publicId: varchar("public_id", { length: 21 }).unique().notNull(),
		name,
		tool: varchar("tool", { enum: Object.keys(INTEGRATIONS) as [string, ...string[]] }),
		config: json("config"),
	},
	(table) => ({
		nameIndex: index("itg_name_idx").on(table.name),
	}),
)

export const destination = pgTable(
	"destinations",
	{
		...commonFields,
		workspaceId: varchar("workspace_id", { length: 128 })
			.notNull()
			.references(() => organizations.publicId),
		publicId: varchar("public_id", { length: 21 }).unique().notNull(),
		name,
		url: url.notNull(),
		websocket_connection: boolean("websocket_connection").default(false).notNull(),
	},
	(table) => ({}),
)

export const connection = pgTable(
	"connections",
	{
		...commonFields,
		workspaceId: varchar("workspace_id", { length: 128 })
			.notNull()
			.references(() => organizations.publicId),
		publicId: varchar("public_id", { length: 21 }).unique().notNull(),
		name,
		enabled,

		sourceId: integer("source_id")
			.notNull()
			.references(() => source.id),
		destinationId: integer("destination_id")
			.notNull()
			.references(() => destination.id),

		delay: integer("delay"),

		retyCount: integer("retry_count"),
		retryDelay: integer("retry_delay"),
		retryType: varchar("retry_type", { enum: ["fixed", "exponential"] }),

		fluxConfig: json("flux_config"),
	},
	(table) => ({
		unq: unique().on(table.sourceId, table.destinationId),
	}),
)

export const apiKeys = pgTable(
	"api_keys",
	{
		...commonFields,
		workspaceId: varchar("workspace_id", { length: 128 })
			.notNull()
			.references(() => organizations.publicId),
		publicId: varchar("public_id", { length: 21 }).unique().notNull(),
		ownerId: varchar("owner_id", { length: 128 }),
		name: varchar("name", { length: 128 }),
		expires: timestamp("expires", { precision: 3 }),
	},
	(table) => ({}),
)

export const organizations = pgTable(
	"organizations",
	{
		id: serial("id").primaryKey(),
		publicId: varchar("public_id", { length: 21 }).unique().notNull(),

		ownerId: varchar("owner_id", { length: 128 }).notNull(),

		name: varchar("name", { length: 128 }).notNull(),

		plan: varchar("plan", { enum: ["free", "pro", "enterprise"] }),

		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
		deletedAt: timestamp("deleted_at"),
	},
	(table) => ({}),
)

export const organizationMembers = pgTable(
	"organization_members",
	{
		id: serial("id").primaryKey(),
		publicId: varchar("public_id", { length: 21 }).unique().notNull(),

		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
		deletedAt: timestamp("deleted_at"),

		userId: uuid("user_id")
			.references(() => user.id)
			.notNull(),
		organizationId: integer("organization_id")
			.notNull()
			.references(() => organizations.id),
		role: role,
	},
	(table) => ({
		roleIdx: index("role_id_idx").on(table.role),
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
		organizationId: integer("organization_id")
			.notNull()
			.references(() => organizations.id),
	},
	(table) => ({
		emailIdx: uniqueIndex("email_idx").on(table.email),
	}),
)

export const userRelation = relations(user, ({ many }) => ({
	memberships: many(organizationMembers),
}))

export const organizationRelations = relations(organizations, ({ many }) => ({
	members: many(organizationMembers),
	invites: many(organizationInvites),
}))

export const organizationMemberRelations = relations(organizationMembers, ({ one }) => ({
	organization: one(organizations, {
		fields: [organizationMembers.organizationId],
		references: [organizations.id],
	}),
	user: one(user, {
		fields: [organizationMembers.userId],
		references: [user.id],
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

export type InsertUser = InferModel<typeof user, "insert">
export type User = InferModel<typeof user, "select">

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
