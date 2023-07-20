import Elysia from "elysia"
import { nanoid } from "nanoid"
import db from "db/src/drizzle"
import { Destination } from "db/src/drizzle/schema"
import { forwardToDestinations } from "./forward"
import { logTinybirdEvents } from "./response-event"
import { forwardToDevServer } from "./forward-dev"



export function addHookIngestEndpoint(elysia: Elysia) {
	return elysia.post("/:sourceId", async ({ params, set, request }) => {
		const source = await db.source.getOne({
			publicId: params.sourceId,
		})
		// console.timeEnd("Test")

		if (!source) {
			set.status = 404
			return {
				status: "404",
				message: "No source found with that id",
			}
		}

		//:!! Comment this out for  dev ya know @JeremyFunk
		if (source.url !== request.url) {
			// set.status = 403
			// return {
			// 	status: "403",
			// 	message: `${request.url} doesn't match Source (${source.url})`,
			// }
		}

		if (source.connections.length === 0) {
			set.status = 404
			return {
				status: "404",
				message: "No connections found for that source",
			}
		}

		const destinations = source.connections.filter((c) => c.enabled).flatMap((connection) => connection.destination)
		const requestId = `req_${nanoid()}`

		await handleRequest({
			request,
			customerId: source.customerId,
			requestId,
			destinations,
			sourceId: source.publicId,
		})
	})
}

export async function handleRequest({
	request,
	destinations,
	sourceId,
	customerId,
	requestId,
}: { request: Request; destinations: Destination[]; sourceId: string; customerId: string; requestId: string }) {
	try {
		const cloned = request.clone()
		const results = await forwardToDestinations({ request: cloned, destinations })
		const responses = await logTinybirdEvents({
			results,
			customerId,
			destinations,
			requestId,
			sourceId,
		})
		await forwardToDevServer({ destinations, responses })
	} catch (e) {
		console.log(e)
	}
}

