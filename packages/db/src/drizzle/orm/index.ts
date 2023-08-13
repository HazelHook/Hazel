import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js"

import * as integrations from "../integrations/common"
import * as integrationsData from "../integrations/data"
import * as schema from "../schema"

import postgres from "postgres"
import sourceLogic from "./tables/source"
import destinationLogic from "./tables/destination"
import connectionLogic from "./tables/connection"
import integrationLogic from "./tables/integration"
import apiKeysLogic from "./tables/apiKeys"
import organizationsLogic from "./tables/organization"

export { integrationsData }

export { integrations }

export type DB = PostgresJsDatabase<typeof schema>

export type OptionalExceptFor<T, K extends keyof T> = Partial<T> & Pick<T, K>

export function connectDB({
	connectionString,
}: {
	connectionString: string
}) {
	// if (!connectionString) {
	// 	throw new Error("Connection String cant be empty")
	// }

	const client = postgres(connectionString)

	const db = drizzle(client, { schema })

	return {
		db,
		source: sourceLogic(db),
		destination: destinationLogic(db),
		connection: connectionLogic(db),
		integration: integrationLogic(db),
		apiKeys: apiKeysLogic(db),
		organization: organizationsLogic(db),
	}
}

export default connectDB({
	connectionString: process.env.DB_CONNECTION_STRING as string,
})
