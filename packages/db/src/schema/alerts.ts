import { index, json, mysqlEnum, mysqlTable, serial, text, timestamp, varchar } from "drizzle-orm/mysql-core"

export const alerts = mysqlTable(
	"alerts",
	{
		id: serial("id").autoincrement(),
		workspaceId: varchar("workspace_id", { length: 128 }).notNull(),
		level: mysqlEnum("level", ["info", "warning", "error", "critical"]).default("info"),
		code: text("code"),
		affectedElements: json("affected_elements").$type<{
			sourceId?: string
			destinationId?: string
			connectionId?: string
			billing?: boolean
		}>(),
	},
	(table) => ({
		workspaceIdx: index("workspace_idx").on(table.workspaceId),
	}),
)
