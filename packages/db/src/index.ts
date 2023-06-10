import { createClient } from "@libsql/client/web"
import { drizzle, LibSQLDatabase } from "drizzle-orm/libsql"

import * as schema from "./schema"

export type DB = LibSQLDatabase<typeof schema>

export function connectDB({
	databaseUrl,
	authToken,
}: {
	databaseUrl: string
	authToken: string
}) {
	const client = createClient({
		url: databaseUrl,
		authToken: authToken,
	})
	const db = drizzle(client, { schema })

	return db
}
