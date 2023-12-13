import { index, json, pgEnum, pgTable, varchar } from "drizzle-orm/pg-core"
import { commonFields } from "./common"

import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm"
import { source } from "./sources"

import { INTEGRATIONS } from "@hazel/integrations/web"
import { organizations } from "./organizations"

export const toolEnum = pgEnum("tool", Object.keys(INTEGRATIONS) as [string, ...string[]])

export const integration = pgTable(
	"integrations",
	{
		...commonFields("itg"),
		workspaceId: varchar("workspace_id", { length: 128 })
			.notNull()
			.references(() => organizations.publicId),
		publicId: varchar("public_id", { length: 21 }).unique().notNull(),
		tool: toolEnum("tool").notNull(),
		config: json("config").notNull(),
	},
	(table) => ({}),
)

export const integrationRelations = relations(integration, ({ many }) => ({
	source: many(source),
}))
