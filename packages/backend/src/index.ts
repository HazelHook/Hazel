import { zValidator } from "@hono/zod-validator"
import { connectDB } from "db/src/index"
import { getConnection } from "db/src/orm/connection"
import { connection } from "db/src/schema"
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
	LIBSQL_DB_URL: string
	LIBSQL_DB_AUTH_TOKEN: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use("/*", cors())
app.use("*", prettyJSON())

app.get("/", (c) => c.text("Hello Hono!"))
app.post("/", (c) => {
	console.log(c)
	return c.text("Hello Hono!")
})

app.post("/seed", zValidator("json", z.object({ amount: z.number() })), async (c) => {
	const db = connectDB({
		authToken: c.env.LIBSQL_DB_AUTH_TOKEN,
		databaseUrl: c.env.LIBSQL_DB_URL,
	})
	await db.transaction(async (tx) => {})
})

app.post("/:connectionId", zValidator("json", z.any()), async (c) => {
	const db = connectDB({
		authToken: c.env.LIBSQL_DB_AUTH_TOKEN,
		databaseUrl: c.env.LIBSQL_DB_URL,
	})

	const connectionId = c.req.param("connectionId")

	const requestsId = `req_${nanoid()}`

	const connection = await getConnection({
		publicId: connectionId,
		db,
	})

	if (!connection) {
		return c.json({
			body: {
				status: "404",
				message: "Connection doesn't exist",
			},
			status: 404,
		})
	}

	console.log(connection)

	// TODO: Check if project exists && Check if request url matches project url

	fetch("http://127.0.0.1:8787/", c.req)

	// c.env.EVENT_MANAGER.fetch("https://google.com", {
	// 	body: JSON.stringify({
	// 		req: {
	// 			method: c.req.method,
	// 			headers: c.req.headers,
	// 			body: c.req.body,
	// 		},
	// 		request_id: requestsId,
	// 		project_id: projectId,
	// 	}),
	// })

	// TODO: Send req as event to tinybird => with requestsId and projectId

	// TODO: Track Usage

	return c.json({
		status: "SUCCESS",
		message: `Webhook handled by Hazelhook. Check your dashboard to inspect the request: https://app.hazelhook.dev/request/${requestsId}`,
		request_id: requestsId,
		connection_id: connection.id,
	})
})

export default {
	fetch: app.fetch,
}
