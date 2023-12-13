import { sql } from "@vercel/postgres"
import { drizzle, VercelPgDatabase } from "drizzle-orm/vercel-postgres"

import * as schema from "../schema"
import apiKeysLogic from "./tables/apiKeys"
import connectionLogic from "./tables/connection"
import destinationLogic from "./tables/destination"
import integrationLogic from "./tables/integration"
import organizationsLogic from "./tables/organization"
import sourceLogic from "./tables/source"
import userLogic from "./tables/user"

export type DB = VercelPgDatabase<typeof schema>

export type OptionalExceptFor<T, K extends keyof T> = Partial<T> & Pick<T, K>

export function connectDB({
	connectionString,
}: {
	connectionString: string
}) {
	const db = drizzle(sql, { schema, logger: false })

	return {
		db,
		source: sourceLogic(db),
		destination: destinationLogic(db),
		connection: connectionLogic(db),
		integration: integrationLogic(db),
		apiKeys: apiKeysLogic(db),
		organization: organizationsLogic(db),
		user: userLogic(db),
	}
}

export default connectDB({
	connectionString: process.env.DATABASE_URL as string,
})
