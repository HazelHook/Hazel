import { nanoid } from "nanoid"

import type { Connection, Destination } from "db/src/drizzle/schema"
import tiny from "db/src/tinybird"
import { ConnectionOptions, Queue } from "bullmq"
import { handleRequest } from "./lib/request.helper"

interface Event {
	connection: Connection & {
		destination: Destination
	}
	request: Request
	sourceId: string
	requestId: string
	customerId: string
	data: string
}

const redisConnection: ConnectionOptions = {
	username: process.env.REDIS_USERNAME,
	password: process.env.REDIS_PASSWORD,
	tls: {
		host: process.env.REDIS_HOST,
		port: Number(process.env.REDIS_PORT),
	},
}

const sourceQueue = new Queue("source_queue", {
	connection: redisConnection,
})

export const sendEvent = async ({ connection, sourceId, requestId, customerId, request }: Event) => {
	try {
		const sendTime = new Date().toISOString()
		const res = await fetch(connection.destination.url, request.clone())

		const headersObj: Record<string, string> = {}
		res.headers.forEach((value, key) => {
			headersObj[key] = value
		})

		await tiny.response.publish({
			id: `res_${nanoid(17)}`,
			timestamp: new Date().toISOString(),
			send_timestamp: sendTime,
			source_id: sourceId,
			customer_id: customerId,
			version: "1.0",
			request_id: requestId,
			destination_id: connection.destination.publicId,
			body: await res.text(),
			headers: JSON.stringify(headersObj),
			status: res.status,
			success: Number(res.ok),
		})

		if (!res.ok) {
			const data: { connectionId: string; requestId: string; request: string } = {
				requestId,
				connectionId: connection.publicId,
				request: await handleRequest(connection.destination.url, request),
			}

			console.log("hi")

			sourceQueue.add(requestId, data, { delay: 10, attempts: 5 })
		}
	} catch (error) {
		console.log(error)
		// TODO: LOG ERORS HERE ON OUR SIDE

		const data: { connectionId: string; requestId: string; request: string } = {
			requestId,
			connectionId: connection.publicId,
			request: await handleRequest(connection.destination.url, request),
		}
		sourceQueue.add(requestId, data, { delay: 10, attempts: 5 })
	}
}
