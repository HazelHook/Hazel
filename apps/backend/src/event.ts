import type { Connection, Destination } from "@hazel/db/schema"
import tiny from "@hazel/tinybird"
import { nanoid } from "nanoid"

import { sourceQueue } from "./lib/queue"
import { handleRequest } from "./lib/request.helper"
import { getLogger } from "@hazel/utils"

interface Event {
	connection: Connection & {
		destination: Destination
	}
	sourceKey: string
	request: Request
	body: string
	sourceId: string
	requestId: string
	workspaceId: string
	received_at: string
}

export const sendEvent = async ({
	connection,
	sourceKey,
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
			method: "POST",
			headers: {
				...request.headers,
				"X-HAZEL_KEY": `${connection.destination.key}-${sourceKey}`,
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
			response_at: new Date().toISOString(),
			source_id: sourceId,
			workspace_id: workspaceId,
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
				request: await handleRequest(connection.destination.url, request, body),
			}

			sourceQueue.add(requestId, data, {
				delay: connection.delay || 0,
				attempts: connection.retyCount,
				backoff: {
					type: connection.retryType,
					delay: connection.retryDelay,
				},
			})
		}
	} catch (error) {
		getLogger().info(`Response Failed with Error: ${error}`)

		const data: { connectionId: string; requestId: string; request: string } = {
			requestId,
			connectionId: connection.publicId,
			request: await handleRequest(connection.destination.url, request, body),
		}
		sourceQueue.add(requestId, data, { delay: 10, attempts: 5 })
	}
}
