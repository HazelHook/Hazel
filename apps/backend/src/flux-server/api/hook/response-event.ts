import { nanoid } from "nanoid";
import { ForwardResult } from "./forward";
import tiny from "db/src/tinybird"
import { Destination } from "db/src/drizzle/schema";

export interface ResponseResult {
	body: string
	headers: string
	id: string
	request_id: string
	timestamp: string
	send_timestamp: string
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
}: { results: ForwardResult[]; sourceId: string; customerId: string; requestId: string; destinations: Destination[] }): Promise<ResponseResult[]> {
	let i = 0
	const tinyResponsePromises = []
	const responseResults: ResponseResult[] = []
	for (const { result, resultError, time, sendTime } of results) {
		const responseResult: ResponseResult = {
            body: (result ? await result.text() : resultError.toString()),
            headers: JSON.stringify(result?.headers ?? {}),
            success: Number(result?.ok ?? !resultError),
            status: result?.status ?? 500,

            id: `res_${nanoid(17)}`,
            request_id: requestId,
            timestamp: time,
            send_timestamp: sendTime,
            destination_id: destinations[i].publicId,
            source_id: sourceId,
        }

		responseResults.push(responseResult)

		tinyResponsePromises.push(
			tiny.response.publish({
				...responseResult,
				customer_id: customerId,
				version: "1.0",
			}),
		)

		i++
	}

	await Promise.all(tinyResponsePromises)
	return responseResults
}