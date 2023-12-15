import { index, json, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core"

export const levelEnum = pgEnum("level", ["info", "warning", "error", "critical"])

export const alerts = pgTable(
	"alerts",
	{
		id: serial("id").primaryKey(),
		workspaceId: varchar("workspace_id", { length: 128 }).notNull(),
		level: levelEnum("level").default("info"),
		code: text("code"),
		affectedElements: json("affected_elements").$type<{
			sourceId?: string
			destinationId?: string
			connectionId?: string
			billing?: boolean
		}>(),
		timestamp: timestamp("timestamp"),
	},
	(table) => ({
		workspaceIdx: index("workspace_idx").on(table.workspaceId),
	}),
)
