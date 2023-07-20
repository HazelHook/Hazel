import { Destination } from "db/src/drizzle/schema"

export type ForwardResult = {
	result?: Response
	resultError?: undefined
	time: string
	sendTime: string
} | {
	resultError?: any
	result?: undefined
	time: string
	sendTime: string
}

/**
 * Forwards a request to a list of destinations.
 */
export async function forwardToDestinations({
	request,
	destinations,
}: { request: Request; destinations: Destination[] }): Promise<ForwardResult[]> {
	const promises = destinations.map(async (d): Promise<ForwardResult> => {
		const sendTime = Date.now().toString()
		try {
			const result = await fetch(d.url, request)
			return {
				result,
				time: Date.now().toString(),
				sendTime,
			}
		} catch (e) {
			return {
				resultError: e,
				time: Date.now().toString(),
				sendTime,
			}
		}
	})
	return await Promise.all(promises)
}
