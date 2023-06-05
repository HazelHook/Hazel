import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { prettyJSON } from "hono/pretty-json"
import { nanoid } from "nanoid"
import z from "zod"

export type Env = {}

const app = new Hono<{ Bindings: Env }>()

app.use("/*", cors())
app.use("*", prettyJSON())

app.get("/", (c) => c.text("Hello Hono!"))

app.post("/:projectId", zValidator("json", z.any()), async (c) => {
	const projectId = c.req.param("projectId")

	const requestsId = `req_${nanoid()}`

	// const projects = await getProject(id)

	// TODO: Check if project exists && Check if request url matches project url

	const res = await fetch("https://google.com", {
		method: c.req.method,
		headers: c.req.headers,
		body: c.req.body,
	})
	console.log(res)

	// TODO:Send both res and req as event to tinybird => both with requestsId and projectId

	// TODO: Track Usage

	return c.json({
		status: "SUCCESS",
		message: `Webhook handled by Hazelhook. Check your dashboard to inspect the request: https://app.hazelhook.dev/request/${requestsId}`,
		request_id: requestsId,
		project_id: projectId,
	})
})

export default app
