import { drizzle, PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless"
import { connect } from "@planetscale/database"

import * as schema from "../schema"
import apiKeysLogic from "./tables/apiKeys"
import connectionLogic from "./tables/connection"
import destinationLogic from "./tables/destination"
import integrationLogic from "./tables/integration"
import organizationsLogic from "./tables/organization"
import sourceLogic from "./tables/source"
import userLogic from "./tables/user"

export type DB = PlanetScaleDatabase<typeof schema>

export type OptionalExceptFor<T, K extends keyof T> = Partial<T> & Pick<T, K>

export function connectDB({ host, username, password }: { host: string; username: string; password: string }) {
	// if (!connectionString) {
	// 	throw new Error("Connection String cant be empty")
	// }

	const client = connect({ host, username, password })

	const db = drizzle(client, { schema })

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
	username: process.env.DATABASE_USERNAME as string,
	host: process.env.DATABASE_HOST as string,
	password: process.env.DATABASE_PASSWORD as string,
})
