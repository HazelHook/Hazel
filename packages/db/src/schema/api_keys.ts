import { pgTable, index, timestamp, varchar } from "drizzle-orm/pg-core"
import { commonFields } from "./common"
import { organizations } from "./organizations"

export const apiKeys = pgTable(
	"api_keys",
	{
		...commonFields("sk"),
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
