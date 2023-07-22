import db from "db/src/drizzle"
import { t } from "elysia"

import { CLIAuthenticatedDTO } from "."
import { ElysiaCLIHandler } from ".."

const USERINFO_URL = process.env["CLERK_OAUTH2_USERINFO_URL"] as string

export function retryRequest(elyisa: ElysiaCLIHandler) {
	return elyisa.post(
		"/user/:port",

		async ({ set, body }) => {
			const userInfo = await fetch(USERINFO_URL, {
				headers: {
					Authorization: `Bearer ${body.access_token}`,
				},
			})
			const userInfoJson = (await userInfo.json()) as any

			set.status = 200
			const pDestinations = db.destination.getMany({
				customerId: userInfoJson.user_id,
			})
			const pSources = db.source.getMany({
				customerId: userInfoJson.user_id,
			})
			const pConnections = db.connection.getMany({
				customerId: userInfoJson.user_id,
			})

			const [destinations, sources, connections] = await Promise.all([pDestinations, pSources, pConnections])

			return {
				sources: sources.map((source) => ({
					id: source.publicId,
					name: source.name,
				})),
				destinations: destinations.map((destination) => ({
					id: destination.publicId,
					name: destination.name,
					url: destination.url,
				})),
				connections: connections.map((connection) => ({
					id: connection.publicId,
					name: connection.name,
					source: connection.source.publicId,
					destination: connection.destination.publicId,
				})),
			}
		},
		{
			body: t.Composite([
				CLIAuthenticatedDTO,
				t.Object({
					requestId: t.String(),
				}),
			]),
		},
	) as any as ElysiaCLIHandler
}
