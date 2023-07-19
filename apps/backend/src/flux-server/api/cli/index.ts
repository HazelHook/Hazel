import Elysia, { ElysiaInstance, Handler } from "elysia"
import { getUser } from "./authenticated/user"
import { addCLIOAuthEndpoints } from "./oauth"

export type OAuthClientData = {
	port: string
	client_id: string
	client_secret: string
}

// along when requesting the OAuth URL.
const CLIENT_IDS = JSON.parse(process.env["CLERK_OAUTH2_CLIENT_IDS"] as string) as OAuthClientData[]

export type ElysiaCLIHandler = Elysia<{
	store: {}
	request: {
		oauthClient: OAuthClientData
		schema: {
			query: {
				port: string
			}
		}
	}
	schema: {}
	meta: ElysiaInstance["meta"]
}>

/**
 * Returns the OAuth client for a given port.
 */
const getOAuthClientFromParams: Handler<any, any> = ({ params, set }) => {
	if (!("port" in params)) {
		set.status = 400
		throw new Error("Port is required for CLI requests.")
	}

	const oauthClient = CLIENT_IDS.find((c) => c.port === params.port)
	if (!oauthClient) {
		set.status = 400
		throw new Error("No client found with that port. Please use a port in the 38404:38414 range.")
	}

	return oauthClient
}

export function addCLIEndpoints(elysia: Elysia) {
	return elysia.group("cli", (app) => {
		// We add the getClient function to the Elysia instance so that we can
		// get the client ID and secret for a given port in the handlers.
		const withClient = app.derive((params) => {
			return {
				oauthClient: getOAuthClientFromParams(params),
			}
		}) as any as ElysiaCLIHandler

		// We add the oauth-url endpoint to the Elysia instance
		const withOauthEndpoints = addCLIOAuthEndpoints(withClient)
		const withAuthenticatedEndpoints = getUser(withOauthEndpoints)
		

		return withAuthenticatedEndpoints
	})
}
