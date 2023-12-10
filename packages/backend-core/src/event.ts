import type { Connection, Destination } from "@hazel/db"
import tiny from "@hazel/tinybird"

import { genId, getLogger } from "@hazel/utils"
import { ingestMetric } from "@hazel/utils/lago"
import { convertDataForSourceQueue, insertSourceQueue } from "./helpers/queue.helpers"
import { generateSignature } from "./crypto"

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
	shouldThrowOnError?: boolean

	// Secret Key to Sign Webhooks with
	signKey: string

	//  Can have an inital Delay
	delay?: number | null
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
	shouldThrowOnError,
	signKey,
	delay,
}: Event) => {
	try {
		if (delay && delay > 0) {
			const data = await convertDataForSourceQueue({
				destinationUrl: connection.destination.url,
				requestId,
				request,
				connectionId: connection.publicId,
				body,
			})

			insertSourceQueue({ requestId, data, connection })
		} else {
			ingestMetric({ workspaceId, type: "events" })

			console.log(signKey)

			const sendTime = new Date().toISOString()
			const res = await fetch(connection.destination.url, {
				...request.clone(),
				method: "POST",
				body,
				headers: {
					...request.headers,
					"X-HAZEL_KEY": `${connection.destination.key}-${sourceKey}`,
					"X-HAZEL_SIGNATURE": generateSignature(signKey, body),
				},
			})

			const headersObj: Record<string, string> = {}

			// biome-ignore lint/complexity/noForEach: <explanation>
			res.headers.forEach((value, key) => {
				headersObj[key] = value
			})

			await tiny.response.publish({
				id: `res_${genId(17)}`,
				received_at: received_at,
				send_at: sendTime,
				response_at: new Date().toISOString(),
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
				if (shouldThrowOnError) {
					throw new Error(`Request failed with status: ${res.status}`)
				}

				const data = await convertDataForSourceQueue({
					destinationUrl: connection.destination.url,
					requestId,
					request,
					connectionId: connection.publicId,
					body,
				})

				insertSourceQueue({ requestId, data, connection })
			}
		}
	} catch (error) {
		getLogger().info(`Response Failed with Error: ${error}`)

		if (shouldThrowOnError) {
			throw error
		}

		const data = await convertDataForSourceQueue({
			destinationUrl: connection.destination.url,
			requestId,
			request,
			connectionId: connection.publicId,
			body,
		})

		insertSourceQueue({ requestId, data, connection })
	}
}
