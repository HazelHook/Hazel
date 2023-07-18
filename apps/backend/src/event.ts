import { nanoid } from "nanoid"

import type { Connection, Destination } from "db/src/drizzle/schema"
import tiny from "db/src/tinybird"
import { handleRequest } from "./lib/request.helper"
import { sourceQueue } from "./lib/queue"

interface Event {
	connection: Connection & {
		destination: Destination
	}
	request: Request
	body: string
	sourceId: string
	requestId: string
	customerId: string
	data: string
}

export const sendEvent = async ({ connection, sourceId, requestId, customerId, request, body }: Event) => {
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
			body: body,
			headers: JSON.stringify(headersObj),
			status: res.status,
			success: Number(res.ok),
		})

		if (!res.ok) {
			const data: { connectionId: string; requestId: string; request: string } = {
				requestId,
				connectionId: connection.publicId,
				request: await handleRequest(connection.destination.url, request, body),
			}

			sourceQueue.add(requestId, data, { delay: 10, attempts: 5 })
		}
	} catch (error) {
		console.log(error)
		// TODO: LOG ERORS HERE ON OUR SIDE

		const data: { connectionId: string; requestId: string; request: string } = {
			requestId,
			connectionId: connection.publicId,
			request: await handleRequest(connection.destination.url, request, body),
		}
		sourceQueue.add(requestId, data, { delay: 10, attempts: 5 })
	}
}
