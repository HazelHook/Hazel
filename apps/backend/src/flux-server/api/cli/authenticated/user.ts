import db from "@hazel/db"

import { CLIAuthenticatedDTO } from "."
import { ElysiaCLIHandler } from ".."

const USERINFO_URL = process.env.CLERK_OAUTH2_USERINFO_URL as string

export function getUser(elyisa: ElysiaCLIHandler) {
	return elyisa.post(
		"/user/:port",

		async ({ set, body }) => {
			const userInfo = await fetch(USERINFO_URL, {
				headers: {
					Authorization: `Bearer ${body.access_token}`,
				},
			})
			const userInfoJson = (await userInfo.json()) as any

			// TODO: @Actyc WORKSPACEID NEEDS TO BE IMPLEMENTED PROBS IDK WHAT UR DOING HERE

			set.status = 200
			const pDestinations = db.destination.getMany({
				workspaceId: userInfoJson.workspaceId,
			})
			const pSources = db.source.getMany({
				workspaceId: userInfoJson.workspaceId,
			})
			const pConnections = db.connection.getMany({
				workspaceId: userInfoJson.workspaceId,
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
		{ body: CLIAuthenticatedDTO },
	) as any as ElysiaCLIHandler
}
