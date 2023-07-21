import express from "express"
import { getUnusedPort } from "./core/lib/util.js"
import { RequestClient } from "./core/lib/request-client.js"
import { handleOAuthCallback } from "./core/api/login.js"
import { handleRequestEvent } from "./core/event/index.js"
import { getModule } from "./modules/index.js"
import { getToken } from "./core/lib/auth-token.js"

const app = express()
global.hazelModule = getModule()

const port = (await getUnusedPort()).toString() as string
process.env["PORT"] = port

const client = new RequestClient()
await global.hazelModule.init({
	client,
	port
})
global.hazelModule.setRequestEventCallback((event) => handleRequestEvent(event, client))


app.get("/oauth2/callback?", handleOAuthCallback(client, () => {
	global.hazelModule.onResponseEvent({type: "login"})
}))
app.listen(port)
const token = await getToken(client)

global.hazelModule.start(token?.access_token)



