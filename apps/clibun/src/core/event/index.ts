import { CLIRequestEvent } from "../../modules/module.js"
import { getToken, openLogin } from "../lib/auth-token.js"
import { RequestClient } from "../lib/request-client.js"
import { handleWebsocketRequestEvent } from "./websocket.js"

export async function handleRequestEvent(event: CLIRequestEvent, client: RequestClient) {
	if (event.type === "websocket-connect") {
		handleWebsocketRequestEvent(event)
	} else if (event.type === "login") {
		openLogin(client)
	} else if (event.type === "user-data") {
		const token = await getToken(client)
		if (!token) {
			console.log("The token was invalidated. Please login again.")
			process.exit(1)
		}

		client.setToken(token.access_token)
		const data = await client.post(`/v1/cli/user/${process.env["PORT"]}`, {
			access_token: token.access_token,
		})

		global.hazelModule.onResponseEvent({
			data,
			type: "user-data",
		})
	}
}
