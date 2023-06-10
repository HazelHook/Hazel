import { faker } from "@faker-js/faker"
import { zValidator } from "@hono/zod-validator"
import { connectDB } from "db/src/index"
import { getConnectionsForSource } from "db/src/orm/connection"
import { getSource } from "db/src/orm/source"
import { connection, destination, project, source } from "db/src/schema"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { prettyJSON } from "hono/pretty-json"
import { nanoid } from "nanoid"
import z from "zod"
import { handleEvent } from "./eventManager"

// import { fluxTransformConnection } from "./wasm/transformation"

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

app.get("/", (c) => c.text("Hazel Backend"))
app.post("/", async (c) => {
	console.log(await c.req.json())
	return c.text("Hello Hono!")
})

app.get("/random", async (c) => {
	const db = connectDB({
		authToken: c.env.LIBSQL_DB_AUTH_TOKEN,
		databaseUrl: c.env.LIBSQL_DB_URL,
	})
	const connection = await db.query.connection.findFirst()

	return c.json(connection)
})

app.post("/seed", zValidator("json", z.object({ amount: z.number() })), async (c) => {
	const db = connectDB({
		authToken: c.env.LIBSQL_DB_AUTH_TOKEN,
		databaseUrl: c.env.LIBSQL_DB_URL,
	})
	const customer = `cus_${nanoid(16)}`
	const data: {
		sourceId: string
		projectId: string
	}[] = []

	for (let i = 0; i < c.req.valid("json").amount; i++) {
		await db.transaction(async (tx) => {
			const projectPublicId = `prj_${nanoid()}`
			const projectRes = await tx
				.insert(project)
				.values({
					name: `Project ${faker.internet.userName()}`,
					publicId: projectPublicId,
					customerId: customer,

					slug: faker.internet.domainWord(),
				})
				.run()

			const sourcePublicId = `src_${nanoid()}`
			const sourceRes = await tx
				.insert(source)
				.values({
					name: `Source ${faker.internet.userName()}`,
					publicId: sourcePublicId,
					customerId: customer,

					url: "http://127.0.0.1:3000/",
				})
				.run()
			const destinationRes = await tx
				.insert(destination)
				.values({
					name: `Destination ${faker.internet.userName()}`,
					publicId: `dst_${nanoid()}`,
					customerId: customer,

					url: "http://127.0.0.1:8787/",
				})
				.run()

			await tx
				.insert(connection)
				.values({
					name: `Connection ${faker.internet.userName()}`,
					publicId: `con_${nanoid()}`,
					customerId: customer,
					fluxConfig: JSON.stringify({
						input: {
							type: "json",
						},
						output: {
							type: "json",
						},
						transformers: [
							{
								type: "uppercase",
							},
						],
					}),
					sourceId: sourceRes.lastInsertRowid as unknown as number,
					destinationId: destinationRes.lastInsertRowid as unknown as number,

					projectId: projectRes.lastInsertRowid as unknown as number,
				})
				.run()

			data.push({
				sourceId: sourcePublicId,
				projectId: projectPublicId,
			})
		})
	}

	return c.json({
		message: `Created ${c.req.valid("json").amount} new connections`,
		data,
	})
})

app.post("/:sourceId", zValidator("json", z.any()), async (c) => {
	const db = connectDB({
		authToken: c.env.LIBSQL_DB_AUTH_TOKEN,
		databaseUrl: c.env.LIBSQL_DB_URL,
	})

	const sourceId = c.req.param("sourceId")
	const source = await getSource({ publicId: sourceId, db })

	if (!source) {
		return c.json(
			{
				body: {
					status: "404",
					message: "No source found with that id",
				},
			},
			404,
		)
	}

	//:!! Comment this out for  dev ya know @JeremyFunk
	if (source.url !== c.req.url) {
		return c.json(
			{
				body: {
					status: "403",
					message: `${c.req.url} doesn't match Source (${source.url})`,
				},
			},
			403,
		)
	}

	if (source.connections.length === 0) {
		return c.json(
			{
				body: {
					status: "404",
					message: "No connections found for that source",
				},
			},
			404,
		)
	}

	const requestId = `req_${nanoid()}`
	const data = await c.req.text()

	for (const conn of source.connections) {
		// TODO: Check if project exists && Check if request url matches project url

		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		await handleEvent({ connection: conn as any, context: c, data: data })

		// TODO: Send req as event to tinybird => with requestsId and projectId

		// TODO: Track Usage
	}
	return c.json({
		status: "SUCCESS",
		message: `Webhook handled by Hazelhook. Check your dashboard to inspect the request: https://app.hazelhook.dev/request/${requestId}`,
		request_id: requestId,
	})
})

export default {
	fetch: app.fetch,
}
