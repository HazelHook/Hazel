import { index, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core"
import { commonFields } from "./common"
import type { InferInsertModel, InferSelectModel } from "drizzle-orm"

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

export type InsertApiKey = InferInsertModel<typeof apiKeys>
export type ApiKey = InferSelectModel<typeof apiKeys>
