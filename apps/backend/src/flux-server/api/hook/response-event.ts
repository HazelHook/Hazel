import { Destination } from "db/src/drizzle/schema"
import tiny from "db/src/tinybird"
import { nanoid } from "nanoid"

import { ForwardResult } from "./forward"

export interface ResponseResult {
	body: string
	headers: string
	id: string
	request_id: string
	send_at: string
	response_at: string
	received_at: string
	status: number
	success: number
	destination_id: string
	source_id: string
}

/**
 * Log the response events to Tinybird.
 */
export async function logTinybirdEvents({
	results,
	sourceId,
	workspaceId,
	requestId,
	destinations,
	receivedAt,
}: {
	results: ForwardResult[]
	sourceId: string
	workspaceId: string
	requestId: string
	destinations: Destination[]
	receivedAt: string
}) {
	let i = 0
	const responseIds = []
	const tinyResponsePromises = []
	for (const { result, resultError, send_at, response_at } of results) {
		const responseId = `res_${nanoid(17)}`
		const responseResult: ResponseResult = {
			body: result ? await result.text() : resultError.toString(),
			headers: JSON.stringify(result?.headers ?? {}),
			success: Number(result?.ok ?? !resultError),
			status: result?.status ?? 500,

			id: responseId,
			request_id: requestId,
			received_at: receivedAt,
			send_at,
			response_at,
			destination_id: destinations[i].publicId,
			source_id: sourceId,
		}

		tinyResponsePromises.push(
			tiny.response.publish({
				...responseResult,
				workspace_id: workspaceId,
				version: "1.0",
			}),
		)

		responseIds.push(responseId)

		i++
	}

	await Promise.all(tinyResponsePromises)
	return responseIds
}
