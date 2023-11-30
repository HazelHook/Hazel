import { logger } from "@bogeychan/elysia-logger"
import serverTiming from "@elysiajs/server-timing"
import { Elysia } from "elysia"

import { sourceQueue } from "./lib/queue"
import { v1Route } from "./routes/v1"

export const routeSetup = new Elysia({ name: "setup" }).use(
	logger({
		level: "error",
	})
		.use(serverTiming())
		.trace(async ({ beforeHandle }) => {
			const { time, end } = await beforeHandle

			console.log("Handle took", (await end) - time)
		}),
)

export const app = new Elysia()
	.use(routeSetup)
	.use(v1Route)
	.get("/", async () => {
		return "Hello Hazel WOW"
	})
	.get("/liveness", async () => {
		return process.uptime
	})
	.get("/status", () => `Uptime: ${process.uptime().toFixed()}s`)
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
