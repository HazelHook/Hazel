import { InferInsertModel, InferSelectModel, relations, sql } from "drizzle-orm"
import {
	boolean,
	index,
	int,
	json,
	mysqlEnum,
	mysqlTable,
	serial,
	timestamp,
	unique,
	uniqueIndex,
	varchar,
} from "drizzle-orm/mysql-core"

import { INTEGRATIONS } from "../integrations/data"
import { SchemaType, generatePublicId } from "./common"

const commonFields = (type: SchemaType) => ({
	id: serial("id").primaryKey(),

	publicId: varchar("public_id", { length: 21 })
		.unique()
		.notNull()
		.$defaultFn(() => generatePublicId(type)),

	createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull(),
})

const name = varchar("name", { length: 64 }).notNull()
const url = varchar("url", { length: 128 })
const enabled = boolean("enabled").default(true).notNull()

const role = mysqlEnum("role", ["owner", "admin", "member"]).notNull().default("member")

export const user = mysqlTable("users", {
	id: varchar("id", { length: 256 }).primaryKey().notNull(),
	name: varchar("name", { length: 128 }),
	onboarded: boolean("onboarded").default(false).notNull(),
	profileImage: varchar("profile_image", { length: 128 }),
})

export const source = mysqlTable(
	"sources",
	{
		...commonFields("src"),
		workspaceId: varchar("workspace_id", { length: 128 }).notNull(),
		// .references(() => organizations.publicId),
		publicId: varchar("public_id", { length: 21 }).unique().notNull(),
		name,
		key: varchar("key", { length: 256 }).notNull().unique(),
		integrationId: int("integration_id"),
		// .references(() => integration.id),
	},
	(table) => ({
		workspaceIdx: index("workspace_idx").on(table.workspaceId),
	}),
)

export const integration = mysqlTable(
	"integrations",
	{
		...commonFields("itg"),
		workspaceId: varchar("workspace_id", { length: 128 }).notNull(),
		// .references(() => organizations.publicId),
		publicId: varchar("public_id", { length: 21 }).unique().notNull(),
		name,
		tool: mysqlEnum("tool", Object.keys(INTEGRATIONS) as [string, ...string[]]),
		config: json("config"),
	},
	(table) => ({
		workspaceIdx: index("workspace_idx").on(table.workspaceId),
		nameIndex: index("itg_name_idx").on(table.name),
	}),
)

export const destination = mysqlTable(
	"destinations",
	{
		...commonFields("dst"),
		workspaceId: varchar("workspace_id", { length: 128 }).notNull(),
		// .references(() => organizations.publicId),
		publicId: varchar("public_id", { length: 21 }).unique().notNull(),
		name,
		key: varchar("key", { length: 256 }).notNull().unique(),
		url: url.notNull(),
		websocket_connection: boolean("websocket_connection").default(false).notNull(),
	},
	(table) => ({
		workspaceIdx: index("workspace_idx").on(table.workspaceId),
	}),
)

export const connection = mysqlTable(
	"connections",
	{
		...commonFields("con"),
		workspaceId: varchar("workspace_id", { length: 128 }).notNull(),
		// .references(() => organizations.publicId),
		publicId: varchar("public_id", { length: 21 }).unique().notNull(),
		name,
		enabled,

		sourceId: int("source_id").notNull(),
		// .references(() => source.id),
		destinationId: int("destination_id").notNull(),
		// .references(() => destination.id),

		delay: int("delay"),

		retyCount: int("retry_count"),
		retryDelay: int("retry_delay"),
		retryType: mysqlEnum("retry_type", ["fixed", "exponential"]),

		fluxConfig: json("flux_config"),
	},
	(table) => ({
		destinationIdx: index("destionation_idx").on(table.destinationId),
		sourceIdx: index("source_idx").on(table.sourceId),
		unq: unique().on(table.sourceId, table.destinationId),
	}),
)

export const apiKeys = mysqlTable(
	"api_keys",
	{
		...commonFields("sk"),
		workspaceId: varchar("workspace_id", { length: 128 }).notNull(),
		// .references(() => organizations.publicId),
		publicId: varchar("public_id", { length: 21 }).unique().notNull(),
		ownerId: varchar("owner_id", { length: 128 }),
		name: varchar("name", { length: 128 }),
		expires: timestamp("expires", { fsp: 3 }),
	},
	(table) => ({
		workspaceIdx: index("workspace_idx").on(table.workspaceId),
	}),
)

export const organizations = mysqlTable(
	"organizations",
	{
		id: serial("id").primaryKey(),
		publicId: varchar("public_id", { length: 21 })
			.unique()
			.notNull()
			.$defaultFn(() => generatePublicId("org")),

		ownerId: varchar("owner_id", { length: 128 }).notNull(),

		name: varchar("name", { length: 128 }).notNull(),

		plan: mysqlEnum("plan", ["free", "pro", "enterprise"]),

		profileImage: varchar("profile_image", { length: 256 }),

		createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
		updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
	},
	(table) => ({}),
)

export const organizationMembers = mysqlTable(
	"organization_members",
	{
		id: serial("id").primaryKey(),
		publicId: varchar("public_id", { length: 21 })
			.unique()
			.notNull()
			.$defaultFn(() => generatePublicId("mem")),

		createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
		updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),

		userId: varchar("user_id", { length: 256 }).notNull(),
		// .references(() => user.id)

		organizationId: int("organization_id").notNull(),
		// .references(() => organizations.id, { onDelete: "cascade" }),
		role: role,
	},
	(table) => ({
		roleIdx: index("role_id_idx").on(table.role),
	}),
)

export const organizationInvites = mysqlTable(
	"organization_invites",
	{
		id: serial("id").primaryKey(),
		publicId: varchar("public_id", { length: 21 })
			.unique()
			.notNull()
			.$defaultFn(() => generatePublicId("inv")),

		createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
		revokedAt: timestamp("revoked_at"),

		email: varchar("email", { length: 128 }).notNull(),
		role: role,
		organizationId: int("organization_id").notNull(),
		// .references(() => organizations.id, { onDelete: "cascade" }),
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

export type InsertUser = InferInsertModel<typeof user>
export type User = InferSelectModel<typeof user>

export type InsertConnection = InferInsertModel<typeof connection>
export type Connection = InferSelectModel<typeof connection>

export type InsertDestination = InferInsertModel<typeof destination>
export type Destination = InferSelectModel<typeof destination>

export type InsertSource = InferInsertModel<typeof source>
export type Source = InferSelectModel<typeof source>

export type InsertIntegration = InferInsertModel<typeof integration>
export type Integration = InferSelectModel<typeof integration>

export type InsertApiKey = InferInsertModel<typeof apiKeys>
export type ApiKey = InferSelectModel<typeof apiKeys>

export type InsertOrganization = InferInsertModel<typeof organizations>
export type Organization = InferSelectModel<typeof organizations>

export type InsertOrganizationInvite = InferInsertModel<typeof organizationInvites>
export type OrganizationInvite = InferSelectModel<typeof organizationInvites>

export type InsertOrganizationMember = InferInsertModel<typeof organizationMembers>
export type OrganizationMember = InferSelectModel<typeof organizationMembers>
