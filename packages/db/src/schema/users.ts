import { relations } from "drizzle-orm"
import { boolean, pgTable, varchar } from "drizzle-orm/pg-core"
import { organizationMembers } from "./organizations"

export const user = pgTable("users", {
	id: varchar("id", { length: 256 }).primaryKey().notNull(),
	name: varchar("name", { length: 128 }),
	onboarded: boolean("onboarded").default(false).notNull(),
	profileImage: varchar("profile_image", { length: 128 }),
})

export const userRelation = relations(user, ({ many }) => ({
	memberships: many(organizationMembers),
}))
