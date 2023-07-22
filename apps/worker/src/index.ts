import { ConnectionOptions, MetricsTime, Worker } from "bullmq"
import db from "db/src/drizzle"
import tiny from "db/src/tinybird"
import { nanoid } from "nanoid"

import { consumeBase64 } from "./lib/request.helper"

console.log("Hazel Worked startin up....")

const redisConnection: ConnectionOptions = {
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
		const connection = await db.connection.getOne({
			publicId: job.data.connectionId,
		})

		if (!connection) {
			// Connection was probably deleted, so we can just discard it
			return
		}

		const sendTime = new Date().toISOString()
		const res = await consumeBase64(job.data.request)

		console.log(res.ok)

		const headersObj: Record<string, string> = {}
		res.headers.forEach((value, key) => {
			headersObj[key] = value
		})

		await tiny.response.publish({
			id: `res_${nanoid(17)}`,
			received_at: job.data.received_at,
			send_at: sendTime,
			response_at: new Date().toISOString(),
			source_id: connection.source.publicId,
			workspace_id: connection.customerId,
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
		connection: redisConnection,
		metrics: {
			maxDataPoints: MetricsTime.ONE_WEEK * 2,
		},
	},
)

worker.on("ready", () => {
	console.log("Worker Started and ready")
})
