import { nanoid } from "nanoid";
import { ForwardResult } from "./forward";
import tiny from "db/src/tinybird"
import { Destination } from "db/src/drizzle/schema";

export interface ResponseResult {
	body: string
	headers: string
	id: string
	request_id: string
	request_at: string
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
	customerId,
	requestId,
	destinations,
	requestStart,
}: { results: ForwardResult[]; sourceId: string; customerId: string; requestId: string; destinations: Destination[]; requestStart: string }) {
	let i = 0
	const responseIds = []
	const tinyResponsePromises = []
	for (const { result, resultError, request_at, response_at } of results) {
		const responseId = `res_${nanoid(17)}`
		const responseResult: ResponseResult = {
            body: (result ? await result.text() : resultError.toString()),
            headers: JSON.stringify(result?.headers ?? {}),
            success: Number(result?.ok ?? !resultError),
            status: result?.status ?? 500,

            id: responseId,
            request_id: requestId,
			received_at: requestStart,
			request_at,
			response_at,
            destination_id: destinations[i].publicId,
            source_id: sourceId,
        }

		tinyResponsePromises.push(
			tiny.response.publish({
				...responseResult,
				customer_id: customerId,
				version: "1.0",
			}),
		)

		responseIds.push(responseId)

		i++
	}

	await Promise.all(tinyResponsePromises)
	return responseIds
}