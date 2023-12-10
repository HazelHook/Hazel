import { Destination } from "@hazel/db"

import { ForwardResult } from "./forward"

const BACKEND_URL = process.env.BACKEND_WEBSOCKET_URL_HTTP as string

export async function forwardToDevServer({
	destinations,
	responseIds,
	request,
	requestId,
	queryString,
	sourceId,
	results,
	receivedAt,
}: {
	destinations: Destination[]
	request: Request
	results: ForwardResult[]
	responseIds: string[]
	requestId: string
	queryString: string
	sourceId: string
	receivedAt: string
}) {
	const filteredDestinations = destinations.filter((d) => d.websocket_connection)

	if (filteredDestinations.length > 0) {
		console.log("Forwarding to dev server")
		// TODO: Encrypt this
		await fetch(`${BACKEND_URL}/forward`, {
			body: JSON.stringify({
				body: await request.text(),
				requestId,
				received_at: receivedAt,
				destinations: destinations.map((d, i) => ({
					id: d.publicId,
					responseId: responseIds[i],
					send_at: results.find((r) => r.destinationId === d.publicId)?.send_at,
					response_at: results.find((r) => r.destinationId === d.publicId)?.response_at,
					status: results.find((r) => r.destinationId === d.publicId)?.status,
					url: d.url,
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
