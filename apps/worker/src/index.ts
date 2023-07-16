import { ConnectionOptions, Worker } from "bullmq"

import tiny from "db/src/tinybird"
import db from "db/src/drizzle"
import { nanoid } from "nanoid"
import { consumeBase64 } from "./lib/request.helper"

console.log("Hazel Worked startin up....")

const redisConnection: ConnectionOptions = {
	username: process.env.REDIS_USERNAME,
	password: process.env.REDIS_PASSWORD,
	tls: {
		host: process.env.REDIS_HOST,
		port: Number(process.env.REDIS_PORT),
	},
}

const worker = new Worker<{ connectionId: string; requestId: string; request: string }>(
	"source_queue",
	async (job) => {
		const connection = await db.connection.getOne({ publicId: job.data.connectionId })

		console.log(connection)

		if (!connection) {
			// Connection was probably deleted, so we can just discard it
			return
		}

		const sendTime = Date.now().toString()
		const res = await consumeBase64(job.data.connectionId)

		console.log(res)
		const headersObj: Record<string, string> = {}
		res.headers.forEach((value, key) => {
			headersObj[key] = value
		})

		await tiny.response.publish({
			id: `res_${nanoid(17)}`,
			timestamp: Date.now().toString(),
			send_timestamp: sendTime,
			source_id: connection.source.publicId,
			customer_id: connection.customerId,
			version: "1.0",
			request_id: job.data.requestId,
			destination_id: connection.destination.publicId,
			body: await res.text(),
			headers: JSON.stringify(headersObj),
			status: res.status,
			success: Number(res.ok),
		})
	},
	{
		connection: redisConnection,
	},
)

worker.on("ready", () => {
	console.log("Worker Started and ready")
})
