import { Destination } from "db/src/drizzle/schema"

export type ForwardResult = {
	result?: Response
	resultError?: undefined
	response_at: string
	request_at: string
	destinationId: string
} | {
	resultError?: any
	result?: undefined
	response_at: string
	request_at: string
	destinationId: string
}

/**
 * Forwards a request to a list of destinations.
 */
export async function forwardToDestinations({
	request,
	destinations,
	queryString
}: { request: Request; destinations: Destination[]; queryString: string }): Promise<ForwardResult[]> {
	const promises = destinations.map(async (d): Promise<ForwardResult> => {
		const requestStart = Date.now().toString()
		try {
			const result = await fetch(`${d.url}?${queryString}`, request)
			return {
				result,
				response_at: Date.now().toString(),
				request_at: requestStart,
				destinationId: d.publicId,
			}
		} catch (e) {
			return {
				resultError: e,
				response_at: Date.now().toString(),
				request_at: requestStart,
				destinationId: d.publicId,
			}
		}
	})
	return await Promise.all(promises)
}
