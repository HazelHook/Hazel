import Elysia from "elysia"
import { nanoid } from "nanoid"
import db from "db/src/drizzle"
import { Destination } from "db/src/drizzle/schema"
import { forwardToDestinations } from "./forward"
import { logTinybirdEvents } from "./response-event"
import { forwardToDevServer } from "./forward-dev"



export function addHookIngestEndpoint(elysia: Elysia) {
	return elysia.
	// Before the request is handled, we add a timestamp to the store
	onRequest((c) => {
		(c.store as any).request_start = new Date().toISOString()
	}).
	post("/:sourceId", async ({ params, set, request, store }) => {
		const receivedAt = (store as any).request_start
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

		const queryString = request.url.split("?")[1] ?? ""

		await handleRequest({
			request,
			customerId: source.customerId,
			requestId,
			destinations,
			sourceId: source.publicId,
			queryString,
			receivedAt
		})

		return {
			status: "SUCCESS",
			message: `Webhook handled by Hazelhook. Check your dashboard to inspect the request: https://app.hazelhook.dev/request/${requestId}`,
			request_id: requestId,
		}
	})
}

export async function handleRequest({
	request,
	destinations,
	sourceId,
	customerId,
	requestId,
	queryString,
	receivedAt
}: { request: Request; destinations: Destination[]; sourceId: string; customerId: string; requestId: string; queryString: string; receivedAt: string }) {
	try {
		const cloned = request.clone()
		const results = await forwardToDestinations({ request: cloned, destinations, queryString })
		const responseIds = await logTinybirdEvents({
			results,
			customerId,
			destinations,
			requestId,
			sourceId,
			receivedAt
		})
		await forwardToDevServer({ destinations, results, responseIds, request, requestId, queryString, sourceId, receivedAt })
	} catch (e) {
		console.log(e)
	}
}

