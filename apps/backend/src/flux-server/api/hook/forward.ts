import { Destination } from "db/src/drizzle/schema"

export type ForwardResult = {
	result?: Response
	resultError?: undefined
	response_at: string
	send_at: string
	destinationId: string
	status: number
} | {
	resultError?: any
	result?: undefined
	response_at: string
	send_at: string
	destinationId: string
	status: number
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
		const requestStart = new Date().toISOString()
		try {
			const result = await fetch(`${d.url}?${queryString}`, request)
			return {
				result,
				response_at: new Date().toISOString(),
				send_at: requestStart,
				destinationId: d.publicId,
				status: result.status
			}
		} catch (e) {
			return {
				resultError: e,
				response_at: new Date().toISOString(),
				send_at: requestStart,
				destinationId: d.publicId,
				status: 500
			}
		}
	})
	return await Promise.all(promises)
}
