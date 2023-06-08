import { createClient } from "@libsql/client/web"
import { drizzle } from "drizzle-orm/libsql"

import { migrate } from "drizzle-orm/libsql/migrator"

export function connectDB({ databaseUrl, authToken }: { databaseUrl: string; authToken: string }) {
	const client = createClient({
		url: databaseUrl,
		authToken: authToken,
	})
	const db = drizzle(client)

	migrate(db, { migrationsFolder: "drizzle" })

	return db
}
