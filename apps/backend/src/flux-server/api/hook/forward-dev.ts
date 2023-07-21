import { Destination } from "db/src/drizzle/schema";
import { ForwardResult } from "./forward";

const BACKEND_URL = process.env.BACKEND_WEBSOCKET_URL_HTTP as string

export async function forwardToDevServer({
	destinations,
	responseIds,
	request,
	requestId,
	queryString,
	sourceId,
	results,
	requestStart
}: { destinations: Destination[]; request: Request; results: ForwardResult[]; responseIds: string[]; requestId: string; queryString: string; sourceId: string; requestStart: string }) {
	const filteredDestinations = destinations.filter((d) => d.websocket_connection)
	
	if (filteredDestinations.length > 0) {
		console.log("Forwarding to dev server")
		// TODO: Encrypt this
		await fetch(`${BACKEND_URL}/forward`, {
			body: JSON.stringify({
				body: await request.text(),
				requestId,
				destinations: destinations.map((d, i) => ({
					id: d.publicId,
					responseId: responseIds[i],
					received_at: requestStart,
					request_at: results.find(r => r.destinationId === d.publicId)?.request_at,
					response_at: results.find(r => r.destinationId === d.publicId)?.response_at,
				})),
				sourceId,
				query: queryString,
				headers: request.headers,
				method: request.method,
			}),
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
		})
	}
}
