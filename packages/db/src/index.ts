import { connect } from "@planetscale/database"
import { drizzle, MySql2Database } from "drizzle-orm/mysql2"

import * as schema from "./schema"

export type DB = MySql2Database<typeof schema>

export function connectDB({
	username,
	host,
	password,
}: {
	host: string
	username: string
	password: string
}) {
	const client = connect({
		username,
		host,
		password,
	})
	const db = drizzle(client, { schema })

	return db
}
