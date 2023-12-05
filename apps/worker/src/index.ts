import db from "@hazel/db"
import tiny from "@hazel/tinybird"
import { ConnectionOptions, MetricsTime, Worker } from "bullmq"
import { nanoid } from "nanoid"

import { consumeBase64 } from "./lib/request.helper"
import { getLogger } from "@hazel/utils"
import { ingestMetric } from "@hazel/utils/lago"

console.log("Hazel Worker starting up....")

const redisConnection: ConnectionOptions = {
	host: process.env.REDIS_HOST,
	username: process.env.REDIS_USERNAME,
	password: process.env.REDIS_PASSWORD,
	port: Number(process.env.REDIS_PORT),
}

const worker = new Worker<{
	connectionId: string
	requestId: string
	request: string
	received_at: string
}>(
	"source_queue",
	async (job) => {
		getLogger().info("Doing Job! :) ", job.attemptsMade)

		const connection = await db.connection.getOne({
			publicId: job.data.connectionId,
		})

		if (!connection) {
			// Connection was probably deleted, so we can just discard it
			return
		}

		ingestMetric({ workspaceId: connection.workspaceId, type: "events" })

		const sendTime = new Date().toISOString()
		const res = await consumeBase64(job.data.request)

		const headersObj: Record<string, string> = {}

		// biome-ignore lint/complexity/noForEach: <explanation>
		res.headers.forEach((value, key) => {
			headersObj[key] = value
		})

		await tiny.response.publish({
			id: `res_${nanoid(17)}`,
			received_at: job.data.received_at,
			send_at: sendTime,
			response_at: new Date().toISOString(),
			source_id: connection.source.publicId,
			workspace_id: connection.workspaceId,
			version: "1.0",
			request_id: job.data.requestId,
			destination_id: connection.destination.publicId,
			body: await res.text(),
			headers: JSON.stringify(headersObj),
			status: res.status,
			success: Number(res.ok),
		})

		if (!res.ok) {
			throw new Error("Requeue Message")
		}

		return
	},
	{
		concurrency: 20,
		connection: redisConnection,
		metrics: {
			maxDataPoints: MetricsTime.ONE_WEEK * 2,
		},
	},
)

worker.on("ready", () => {
	getLogger().info("Worker Started and Ready")
})

worker.on("error", (err) => {
	getLogger().error(err)
})
