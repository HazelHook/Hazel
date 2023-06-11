import { zValidator } from "@hono/zod-validator"
import { randWord } from "@ngneat/falso"
import { connectDB } from "db/src/index"
import { getSource } from "db/src/orm/source"
import { connection, destination, project, source } from "db/src/schema"
import { Tiny } from "db/src/tinybird/index"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { nanoid } from "nanoid"
import z from "zod"

import { handleEvent } from "./eventManager"

// import { fluxTransformConnection } from "./wasm/transformation"

export type Bindings = {
	LIBSQL_DB_URL: string
	LIBSQL_DB_AUTH_TOKEN: string
	TINY_TOKEN: string
	HAZELFLUX_BINDING: ServiceWorkerGlobalScope
}

const app = new Hono<{ Bindings: Bindings }>()

app.use("/*", cors())

app.get("/", (c) => c.text("Hazel Backend"))
app.post("/", async (c) => {
	console.log(await c.req.json())
	return c.text("Hello Hono!", 500)
})

app.get("/random", async (c) => {
	const db = connectDB({
		authToken: c.env.LIBSQL_DB_AUTH_TOKEN,
		databaseUrl: c.env.LIBSQL_DB_URL,
	})
	const connection = await db.query.connection.findFirst()

	return c.json(connection)
})

// app.get("/user/:userId", async (c) => {
// 	const userId = c.req.param("userId")

// 	const db = connectDB({
// 		authToken: c.env.LIBSQL_DB_AUTH_TOKEN,
// 		databaseUrl: c.env.LIBSQL_DB_URL,
// 	})

// 	const sources = db.query.source.findMany({
// 		where: eq(source.customerId, userId),
// 	})

// 	return c.json(JSON.stringify(sources))
// })

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
					name: `Project ${randWord({ capitalize: true })}`,
					publicId: projectPublicId,
					customerId: customer,

					slug: randWord({ capitalize: true }),
				})
				.run()

			const sourcePublicId = `src_${nanoid()}`
			const sourceRes = await tx
				.insert(source)
				.values({
					name: `Source ${randWord({ capitalize: true })}`,
					publicId: sourcePublicId,
					customerId: customer,

					url: "http://127.0.0.1:3000/",
				})
				.run()
			const destinationRes = await tx
				.insert(destination)
				.values({
					name: `Destination ${randWord({ capitalize: true })}`,
					publicId: `dst_${nanoid()}`,
					customerId: customer,

					url: "http://127.0.0.1:8787/",
				})
				.run()

			await tx
				.insert(connection)
				.values({
					name: `Connection ${randWord({ capitalize: true })}`,
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
	const test = await c.env.HAZELFLUX_BINDING.fetch(c.req.raw.clone())
	console.log(await test.text())
	const db = connectDB({
		authToken: c.env.LIBSQL_DB_AUTH_TOKEN,
		databaseUrl: c.env.LIBSQL_DB_URL,
	})

	const tiny = Tiny(c.env.TINY_TOKEN)

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
		// return c.json(
		// 	{
		// 		body: {
		// 			status: "403",
		// 			message: `${c.req.url} doesn't match Source (${source.url})`,
		// 		},
		// 	},
		// 	403,
		// )
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

	const headersObj: Record<string, string> = {}
	c.req.headers.forEach((value, key) => {
		headersObj[key] = value
	})

	await tiny.publishRequestEvent({
		timestamp: new Date().toISOString(),
		source_id: source.publicId,
		customer_id: source.customerId,
		version: "1.0",
		request_id: requestId,
		body: data,
		headers: JSON.stringify(headersObj),
	})

	for (const conn of source.connections) {
		// TODO: Check if project exists && Check if request url matches project url

		await handleEvent({
			// rome-ignore lint/suspicious/noExplicitAny: type is strange so whatever
			connection: conn as any,
			context: c,
			data: data,
			requestId,
			customerId: source.customerId,
			sourceId: source.publicId,
		})

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
