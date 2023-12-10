import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm"
import { boolean, mysqlTable, varchar } from "drizzle-orm/mysql-core"
import { organizationMembers } from "./organizations"

export const user = mysqlTable("users", {
	id: varchar("id", { length: 256 }).primaryKey().notNull(),
	name: varchar("name", { length: 128 }),
	onboarded: boolean("onboarded").default(false).notNull(),
	profileImage: varchar("profile_image", { length: 128 }),
})

export const userRelation = relations(user, ({ many }) => ({
	memberships: many(organizationMembers),
}))
