import { ElysiaCLIHandler } from ".."
import { CLIAuthenticatedDTO } from "."
import db from "db/src/drizzle"

const USERINFO_URL = process.env["CLERK_OAUTH2_USERINFO_URL"] as string

export function getDestinations(elyisa: ElysiaCLIHandler) {
	return elyisa.post(
		"/webhook-destinations/:port",

		async ({ set, body }) => {
			const userInfo = await fetch(USERINFO_URL, {
				headers: {
					Authorization: `Bearer ${body.access_token}`,
				},
			})
			const userInfoJson = (await userInfo.json()) as any

			set.status = 200
			return await db.destination.getMany({
				customerId: userInfoJson.user_id,
			})
		},
		{ body: CLIAuthenticatedDTO },
	) as any as ElysiaCLIHandler
}
