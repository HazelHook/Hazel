import { Elysia, t } from "elysia"

import db from "@hazel/db"
import tiny from "@hazel/tinybird"

import { sendEvent } from "../../event"
import { sourceQueue } from "../../lib/queue"
import { handleRequest } from "../../lib/request.helper"
import { nanoid } from "nanoid"

import crypto from "crypto"
import { extractSvixSignatures } from "../../lib/verification/provider/svix"
import { WebhookVerifierFactory } from "../../lib/verification"

export const v1Route = new Elysia()
	.onParse(({ request }) => {
		return request.text()
	})
	.group("v1", (app) =>
		app
			.get("/", () => {
				return "V1 API"
			})
			.post("/hook/:sourceId", async ({ params, set, request, body, headers }) => {
				const received_at = new Date().toISOString()

				const source = await db.source.getOne({
					publicId: params.sourceId,
				})

				if (!source) {
					set.status = 404
					return {
						status: "404",
						message: "No source found with that id",
					}
				}

				if (source.integration) {
					const webhookVerificationHandler = WebhookVerifierFactory.getVerifier(
						source.integration.tool!,
						source.integration.config,
					)

					if (!webhookVerificationHandler) {
						console.log("Integration isnt implemented")
					} else {
						console.log(webhookVerificationHandler.verifySignature(headers, body as string))
					}
				}

				// if (source.url && source.url !== request.url) {
				// 	set.status = 403
				// 	return {
				// 		status: "403",
				// 		message: `${request.url} doesn't match Source (${source.url})`,
				// 	}
				// }

				if (source.connections.length === 0) {
					set.status = 404
					return {
						status: "404",
						message: "No connections found for that source",
					}
				}

				const requestId = `req_${nanoid()}`

				const headersObj: Record<string, string> = {}

				// biome-ignore lint/complexity/noForEach: <explanation>
				request.headers.forEach((value, key) => {
					headersObj[key] = value
				})

				await tiny.request.publish({
					id: requestId,
					timestamp: new Date().toISOString(),
					source_id: source.publicId,
					workspace_id: source.workspaceId,
					version: "1.0",
					body: String(body),
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

					if (connection.delay && connection.delay > 0) {
						const parsed: {
							connectionId: string
							requestId: string
							request: string
						} = {
							requestId,
							connectionId: connection.publicId,
							request: await handleRequest(connection.destination.url, request, String(body)),
						}

						await sourceQueue.add(requestId, parsed, {
							delay: connection.delay as any,
							attempts: connection.retyCount as any,
							backoff: {
								type: connection.retryType || "fixed",
								delay: connection.retryDelay as any,
							},
						})
					} else {
						await sendEvent({
							request,
							body: String(body),
							connection: connection,
							requestId,
							workspaceId: source.workspaceId,
							sourceId: source.publicId,
							sourceKey: source.key,
							received_at,
						})
					}
				}

				return {
					status: "SUCCESS",
					message: `Webhook handled by Hazelhook. Check your dashboard to inspect the request: https://app.hazelhook.dev/request/${requestId}`,
					request_id: requestId,
				}
			})
			.ws("/ws/:destId", {
				open(ws) {
					console.log("Opened")

					const destinationId: string = (ws.data.params as any).destId

					// Giga insecure
					db.destination.update({
						publicId: destinationId,
						websocket_connection: true,
					})

					// sockets.set(destinationId, ws)
				},
				message(ws, _) {},
				close(ws) {
					console.log("Closed")
					const destinationId: string = (ws.data.params as any).destId
					// sockets.delete(destinationId)
				},
			}),
	)
