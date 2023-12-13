import { text, pgTable, jsonb, timestamp } from "drizzle-orm/pg-core"

export const stripeCustomers = pgTable("stripe_customers", {
	id: text("id"),
	email: text("email"),
	name: text("name"),
	description: text("description"),
	created: timestamp("created", { mode: "string" }),
	attrs: jsonb("attrs"),
})
