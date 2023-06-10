import { faker } from "@faker-js/faker"
import { zValidator } from "@hono/zod-validator"
import { connectDB } from "db/src/index"
import { createConnection, getConnection } from "db/src/orm/connection"
import { createDestination, getDestination } from "db/src/orm/destination"
import { createProject, getProject } from "db/src/orm/project"
import { createSource, getSource } from "db/src/orm/source"
import { connection, destination, project, source } from "db/src/schema"
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
app.post("/seed", async (c) => {
	const db = connectDB({
		authToken: c.env.LIBSQL_DB_AUTH_TOKEN,
		databaseUrl: c.env.LIBSQL_DB_URL,
	})

	const customerId = `cus_${nanoid()}`

	const { id: projectId, publicId: projectPublicId } = await createProject({
		data: {
			customerId: customerId,
			publicId: `prj_${nanoid()}`,
			name: "Project 1",
			slug: "project-1",
		},
		db,
	})

	const { id: connectionId } = await createConnection({
		data: {
			customerId: customerId,
			publicId: `con_${nanoid()}`,
			name: "Connection 1",
			projectId,
		},
		db,
	})

	const { publicId: sourcePublicId } = await createSource({
		data: {
			customerId: customerId,
			publicId: `src_${nanoid()}`,
			name: "Source 1",
			url: "https://google.com",
			connectionId,
		},
		db,
	})

	await createDestination({
		data: {
			customerId: customerId,
			publicId: `dst_${nanoid()}`,
			name: "Destination 1",
			url: "https://google.com",
			connectionId,
		},
		db,
	})

	return c.json({
		status: "SUCCESS",
		message: "Seeded database",
		data: {
			customerId,
			projectId: projectPublicId,
			sourceId: sourcePublicId,
		},
	})
})

app.post("/seed", zValidator("json", z.object({ amount: z.number() })), async (c) => {
	const db = connectDB({
		authToken: c.env.LIBSQL_DB_AUTH_TOKEN,
		databaseUrl: c.env.LIBSQL_DB_URL,
	})
	const customer = `cus_${nanoid(16)}`
	const data: {
		sourceId: string
		projectId: number
	}[] = []

	for (let i = 0; i < c.req.valid("json").amount; i++) {
		await db.transaction(async (tx) => {
			const projectRes = await tx
				.insert(project)
				.values({
					name: `Project ${faker.internet.userName()}`,
					publicId: `con_${nanoid()}`,
					customerId: customer,

					slug: faker.internet.domainWord(),
				})
				.run()

			const conn = await tx
				.insert(connection)
				.values({
					name: `Connection ${faker.internet.userName()}`,
					publicId: `con_${nanoid()}`,
					customerId: customer,

					projectId: projectRes.lastInsertRowid as unknown as number,
				})
				.run()

			const sourcePublicId = `src_${nanoid()}`
			await tx
				.insert(source)
				.values({
					name: `Source ${faker.internet.userName()}`,
					publicId: sourcePublicId,
					customerId: customer,

					url: "http://127.0.0.1:3000/",

					connectionId: conn.lastInsertRowid as unknown as number,
				})
				.run()
			await tx
				.insert(destination)
				.values({
					name: `Destination ${faker.internet.userName()}`,
					publicId: `dst_${nanoid()}`,
					customerId: customer,

					url: "http://127.0.0.1:8787/",

					connectionId: conn.lastInsertRowid as unknown as number,
				})
				.run()

			data.push({
				sourceId: sourcePublicId,
				projectId: projectRes.lastInsertRowid as unknown as number,
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

	const requestId = `req_${nanoid()}`

	const source = await getSource({
		publicId: sourceId,
		db,
	})

	if (!source) {
		return c.json({
			body: {
				status: "404",
				message: "No source found with that id",
			},
			status: 404,
		})
	}

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
		message: `Webhook handled by Hazelhook. Check your dashboard to inspect the request: https://app.hazelhook.dev/request/${requestId}`,
		request_id: requestId,
		connection_id: connection.id,
		project_id: connection.projectId,
	})
})

export default {
	fetch: app.fetch,
}
