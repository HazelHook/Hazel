import { zValidator } from "@hono/zod-validator"
import { TaskManager } from "do-taskmanager"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { prettyJSON } from "hono/pretty-json"
import { nanoid } from "nanoid"
import z from "zod"

type MessageBody = {
	url: string
	req: RequestInit
	request_id: string
	project_id: string
}

export type Bindings = {
	EVENT_MANAGER: ServiceWorkerGlobalScope
}

const app = new Hono<{ Bindings: Bindings }>()

app.use("/*", cors())
app.use("*", prettyJSON())

app.get("/", (c) => c.text("Hello Hono!"))

app.post("/:projectId", zValidator("json", z.any()), async (c) => {
	const projectId = c.req.param("projectId")

	const requestsId = `req_${nanoid()}`

	// const projects = await getProject(id)

	// TODO: Check if project exists && Check if request url matches project url

	c.env.EVENT_MANAGER.fetch("https://google.com", {
		body: JSON.stringify({
			req: {
				method: c.req.method,
				headers: c.req.headers,
				body: c.req.body,
			},
			request_id: requestsId,
			project_id: projectId,
		}),
	})

	// TODO:Send  req as event to tinybird => with requestsId and projectId

	// TODO: Track Usage

	return c.json({
		status: "SUCCESS",
		message: `Webhook handled by Hazelhook. Check your dashboard to inspect the request: https://app.hazelhook.dev/request/${requestsId}`,
		request_id: requestsId,
		project_id: projectId,
	})
})

export default {
	fetch: app.fetch,
}
