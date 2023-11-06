import { Elysia } from "elysia"

import { logger } from "@bogeychan/elysia-logger"

import { sourceQueue } from "./lib/queue"
import { v1Route } from "./routes/v1"

export const routeSetup = new Elysia({ name: "setup" }).use(
	logger({
		level: "error",
	}).trace(async ({ handle }) => {
		const { time, end } = await handle

		console.log("beforeHandle took", (await end) - time)
	}),
)

export const app = new Elysia()
	.use(routeSetup)
	.use(v1Route)
	.get("/", async () => {
		return "Hello Elysia"
	})
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
