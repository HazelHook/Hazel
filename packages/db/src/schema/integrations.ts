import { index, json, mysqlEnum, mysqlTable, varchar } from "drizzle-orm/mysql-core"
import { commonFields } from "./common"

import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm"
import { source } from "./sources"

import { INTEGRATIONS } from "@hazel/integrations/web"

export const integration = mysqlTable(
	"integrations",
	{
		...commonFields("itg"),
		workspaceId: varchar("workspace_id", { length: 128 }).notNull(),
		// .references(() => organizations.publicId),
		publicId: varchar("public_id", { length: 21 }).unique().notNull(),
		tool: mysqlEnum("tool", Object.keys(INTEGRATIONS) as [string, ...string[]]).notNull(),
		config: json("config").notNull(),
	},
	(table) => ({
		workspaceIdx: index("workspace_idx").on(table.workspaceId),
	}),
)

export const integrationRelations = relations(integration, ({ many }) => ({
	source: many(source),
}))

export type InsertIntegration = InferInsertModel<typeof integration>
export type Integration = InferSelectModel<typeof integration>
