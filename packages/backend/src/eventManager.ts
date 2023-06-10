import { Connection, Destination } from "db/src/schema"
import { Context } from "hono"

import { Bindings } from "."
import { Tiny } from "./tiny"

export const handleEvent = async ({
	connection,
	context,
	data,
	sourceId,
	requestId,
	customerId,
}: {
	connection: Connection & {
		destination: Destination
	}
	context: Context<{
		Bindings: Bindings
	}>
	sourceId: string
	requestId: string
	customerId: string
	data: string
}) => {
	const tiny = Tiny(context.env.TINY_TOKEN)

	if (!connection.destination) {
		// TODO: LOG HERE THAT USER NEEDS DESTINATION
		return
	}

	const res = await fetch(connection.destination.url, {
		method: "POST",
		headers: context.req.headers,
		body: data,
	})

	const headersObj: Record<string, string> = {}
	res.headers.forEach((value, key) => {
		headersObj[key] = value
	})

	await tiny.publishResponseEvent({
		timestamp: new Date().toISOString(),
		source_id: sourceId,
		customer_id: customerId,
		version: "1.0",
		request_id: requestId,
		body: await res.text(),
		headers: JSON.stringify(headersObj),
		status: res.status,
		success: Number(res.ok),
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
