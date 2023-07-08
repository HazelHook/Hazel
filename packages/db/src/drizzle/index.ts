import { connect } from "@planetscale/database"
import { drizzle, PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless"

import * as schema from "./schema"

export type DB = PlanetScaleDatabase<typeof schema>

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
	
	return drizzle(client, { schema })
}
