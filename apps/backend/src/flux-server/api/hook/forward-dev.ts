import { Destination } from "db/src/drizzle/schema"
import { ResponseResult } from "./response-event"

const BACKEND_URL = process.env.BACKEND_WEBSOCKET_URL_HTTP as string

export async function forwardToDevServer({
	destinations,
	responses
}: { destinations: Destination[]; responses: ResponseResult[] }) {
	const filteredDestinations = destinations.filter((d) => d.websocket_connection)

	if (filteredDestinations.length > 0) {
		// TODO: Encrypt this
		await fetch(`${BACKEND_URL}/forward`, {
			method: "POST",
			body: JSON.stringify({
				destinations: filteredDestinations.map((destination) =>
					responses.find((r) => r.destination_id === destination.publicId),
				),
			}),
		})
	}
}
