import { relations, sql } from "drizzle-orm"
import { mysqlTable, serial, varchar, mysqlEnum, timestamp, int, index, uniqueIndex } from "drizzle-orm/mysql-core"
import { generatePublicId, roleField } from "./common"
import { user } from "./users"
import { genId } from "@hazel/utils"

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

		secretKey: varchar("secret_key", { length: 32 })
			.notNull()
			.$defaultFn(() => `sk_${genId(29)}`),

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
		role: roleField,
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
		role: roleField,
		organizationId: int("organization_id").notNull(),
		// .references(() => organizations.id, { onDelete: "cascade" }),
	},
	(table) => ({
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
