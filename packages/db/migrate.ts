import * as dotenv from "dotenv"
import { migrate } from "drizzle-orm/libsql/migrator"

import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client/web"

dotenv.config({ path: ".env" })

async function main() {
	const client = createClient({
		// rome-ignore lint/style/noNonNullAssertion: <explanation>
		url: process.env.LIBSQL_DB_URL!,
		authToken:
			// rome-ignore lint/style/noNonNullAssertion: <explanation>
			process.env.LIBSQL_DB_AUTH_TOKEN!,
	})
	const db = drizzle(client)
	await migrate(db, { migrationsFolder: "drizzle" })
}

main()
