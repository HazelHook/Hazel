import Elysia from "elysia";
import { nanoid } from "nanoid";
import { sendEvent } from "../../../event";
import tiny from "db/src/tinybird"
import db from "db/src/drizzle"

const BACKEND_URL = process.env.BACKEND_WEBSOCKET_URL_HTTP as string

export function addHookIngestEndpoint(elysia: Elysia){
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

        const requestId = `req_${nanoid()}`

        const headersObj: Record<string, string> = {}
        request.headers.forEach((value, key) => {
            headersObj[key] = value
        })

        const data = await request.text()

        await tiny.request.publish({
            id: requestId,
            timestamp: Date.now().toString(),
            source_id: source.publicId,
            customer_id: source.customerId,
            version: "1.0",
            body: data,
            headers: JSON.stringify(headersObj),
            validated: 0,
            rejected: 0,
        })

        for (const connection of source.connections) {
            if (!connection.destination) {
                // TODO: LOG HERE THAT USER NEEDS DESTINATION
                return
            }

            if (!connection.enabled) {
                // TODO: Log it
                return
            }

            await sendEvent({
                request,
                connection: connection as any,
                data: data,
                requestId,
                customerId: source.customerId,
                sourceId: source.publicId,
            })
        }


        for (const connection of source.connections) {
            if (!connection.destination || !connection.destination.websocket_connection) {
                // TODO: LOG HERE THAT USER NEEDS DESTINATION
                return
            }

            if (!connection.enabled) {
                // TODO: Log it
                return
            }

            await fetch(`${BACKEND_URL}/forward/${connection.destination.publicId}`, {
                method: "POST",
                body: JSON.stringify({
                    requestId,
                    data,
                    headers: headersObj,
                    sourceId: source.publicId,
                    source: source.name,
                    method: "POST",
                    timestamp: Date.now()
                })
            })
        }

        return {
            status: "SUCCESS",
            message: `Webhook handled by Hazelhook. Check your dashboard to inspect the request: https://app.hazelhook.dev/request/${requestId}`,
            request_id: requestId,
        }
    })
}