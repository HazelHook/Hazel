import { Elysia } from "elysia"

import { nanoid } from "nanoid"
import { sendEvent } from "./event"

import db from "db/src/drizzle"
import tiny from "db/src/tinybird"
import { sourceQueue } from "./lib/queue"

const app = new Elysia()
	.get("/", async () => {
		return "Hello Elysia"
	})
	.group("v1", (app) =>
		app
			.get("/", () => {
				console.log("/")
				return "V1 API"
			})
			.get("/status", () => `Uptime: ${process.uptime().toFixed()}s`)
			.post("/hook/:sourceId", async ({ params, set, request }) => {
				const source = await db.source.getOne({
					publicId: params.sourceId,
				})

				if (!source) {
					set.status = 404
					return {
						status: "404",
						message: "No source found with that id",
					}
				}

				if (source.url && source.url !== request.url) {
					set.status = 403
					return {
						status: "403",
						message: `${request.url} doesn't match Source (${source.url})`,
					}
				}

				if (source.connections.length === 0) {
					set.status = 404
					return {
						status: "404",
						message: "No connections found for that source",
					}
				}

				const requestId = `req_${nanoid()}`

				const headersObj: Record<string, string> = {}
				request.headers.forEach((value, key) => {
					headersObj[key] = value
				})

				const data = await request.text()

				await tiny.request.publish({
					id: requestId,
					timestamp: new Date().toISOString(),
					source_id: source.publicId,
					customer_id: source.customerId,
					version: "1.0",
					body: data,
					headers: JSON.stringify(headersObj),
					validated: 0,
					rejected: 0,
				})

				for (const connection of source.connections) {
					if (!connection.destination) {
						// TODO: LOG HERE THAT USER NEEDS DESTINATION
						return
					}

					if (!connection.enabled) {
						// TODO: Log it
						return
					}

					await sendEvent({
						request,
						body: data,
						connection: connection,
						data: data,
						requestId,
						customerId: source.customerId,
						sourceId: source.publicId,
					})
				}

				return {
					status: "SUCCESS",
					message: `Webhook handled by Hazelhook. Check your dashboard to inspect the request: https://app.hazelhook.dev/request/${requestId}`,
					request_id: requestId,
				}
			}),
	)
	.group("internal", (app) =>
		app.group("queue", (app) =>
			app.get("/metrics", async () => {
				const metrics = {
					current: await sourceQueue.getJobCounts(),
					failed: await sourceQueue.getMetrics("failed"),
					successful: await sourceQueue.getMetrics("completed"),
				}
				return metrics
			}),
		),
	)
	.listen(3003)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
