import type { Connection, Destination } from "@hazel/db/src/drizzle/schema"
import tiny from "@hazel/db/src/tinybird"
import { nanoid } from "nanoid"

import { sourceQueue } from "./lib/queue"
import { handleRequest } from "./lib/request.helper"

interface Event {
	connection: Connection & {
		destination: Destination
	}
	request: Request
	body: string
	sourceId: string
	requestId: string
	workspaceId: string
	data: string
	received_at: string
}

export const sendEvent = async ({
	connection,
	sourceId,
	requestId,
	workspaceId,
	request,
	body,
	received_at,
}: Event) => {
	try {
		const sendTime = new Date().toISOString()
		const res = await fetch(connection.destination.url, {
			...request.clone(),
			headers: {
				...request.headers,
				"X-HAZEL_KEY": connection.destination.key,
				"X-HAZEL_SIGNATURE": "TODO: create signature",
			},
		})

		const headersObj: Record<string, string> = {}

		// biome-ignore lint/complexity/noForEach: <explanation>
		res.headers.forEach((value, key) => {
			headersObj[key] = value
		})

		await tiny.response.publish({
			id: `res_${nanoid(17)}`,
			received_at: received_at,
			send_at: sendTime,
			response_at: new Date(performance.now()).toISOString(),
			source_id: sourceId,
			workspace_id: workspaceId,
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

			sourceQueue.add(requestId, data, {
				delay: connection.delay as any,
				attempts: connection.retyCount as any,
				backoff: {
					type: connection.retryType || "fixed",
					delay: connection.retryDelay as any,
				},
			})
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
