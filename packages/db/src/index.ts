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
	const db = drizzle(client, { schema })

	return db
}

export function connectWDB({
	username,
	host,
	password,
	fetch,
}: {
	host: string
	username: string
	password: string
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	fetch: any
}) {
	const client = connect({
		username,
		host,
		password,
		fetch: (url, init) => {
			// @ts-expect-error
			init["cache"] = undefined
			return fetch(url, init)
		},
	})
	const db = drizzle(client, { schema })

	return db
}
