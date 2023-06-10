import { Connection, Destination } from "db/src/schema"
import { Context } from "hono"
import { Bindings } from "."

export const handleEvent = async ({
	connection,
	context,
	data,
}: {
	connection: Connection & {
		destination: Destination
	}
	context: Context<{
		Bindings: Bindings
	}>
	data: string
}) => {
	if (!connection.destination) {
		// TODO: LOG HERE THAT USER NEEDS DESTINATION
		return
	}

	const res = await fetch(connection.destination.url, {
		method: "POST",
		headers: context.req.headers,
		body: data,
	})

	// Here would need to retry ofc
	if (!res.ok) {
	}

	// c.env.EVENT_MANAGER.fetch("https://google.com", {
	// 	body: JSON.stringify({
	// 		req: {
	// 			method: c.req.method,
	// 			headers: c.req.headers,
	// 			body: c.req.body,
	// 		},
	// 		request_id: requestsId,
	// 		project_id: projectId,
	// 	}),
	// })

	// TODO: Send req as event to tinybird => with requestsId and projectId

	// TODO: Track Usage
}
