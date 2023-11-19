import { t } from "elysia"
import qs from "qs"

import { ElysiaCLIHandler } from ".."

const TOKEN_URL = process.env.CLERK_OAUTH2_TOKEN_URL as string
const USERINFO_URL = process.env.CLERK_OAUTH2_USERINFO_URL as string

export function getOAuthToken(elysia: ElysiaCLIHandler) {
	return elysia
		.post(
			"/token/:port",
			async ({ params, set, body: { token, token_type }, oauthClient }) => {
				const data =
					token_type === "code"
						? {
								grant_type: "authorization_code",
								code: token,
								redirect_uri: `http://localhost:${params.port}/oauth2/callback`,
						  }
						: {
								grant_type: "refresh_token",
								refresh_token: token,
						  }

				const refreshed_token = await fetch(TOKEN_URL, {
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: qs.stringify({
						client_id: oauthClient.client_id,
						client_secret: oauthClient.client_secret,
						...data,
					}),
				})

				set.status = 200
				return await refreshed_token.json()
			},
			{
				body: t.Object({
					token: t.String(),
					token_type: t.Union([t.Literal("code"), t.Literal("refresh_token")]),
				}),
			},
		)
		.post(
			"/verify/:port",
			async ({ params, set, body: { token }, oauthClient }) => {
				try {
					await fetch(USERINFO_URL, {
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					})

					set.status = 200
					return {
						message: "Token is valid.",
					}
				} catch (e) {
					set.status = 401
					return {
						message: "Token is invalid.",
					}
				}
			},
			{
				body: t.Object({
					token: t.String(),
				}),
			},
		) as any as ElysiaCLIHandler
}
