import db from "@hazel/db"
import { WebhookVerifierFactory } from "@hazel/integrations"
import tiny from "@hazel/tinybird"
import { getLogger } from "@hazel/utils"
import { Elysia } from "elysia"
import { nanoid } from "nanoid"

import { sendEvent } from "../../event"
import { sourceQueue } from "../../lib/queue"
import { handleRequest } from "../../lib/request.helper"

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

				if (source.connections.length === 0) {
					set.status = 404
					return {
						status: "404",
						message: "No connections found for that source",
					}
				}

				const verified = {
					valid: false,
					validated: false,
				}

				// Verify Signature if Integration Added to Source
				if (source.integration) {
					verified.validated = true
					const webhookVerificationHandler = WebhookVerifierFactory.getVerifier(
						source.integration.tool!,
						source.integration.config,
					)

					if (webhookVerificationHandler) {
						verified.valid = webhookVerificationHandler.verifySignature(headers, body as string)
					} else {
						getLogger().error("Integration isnt implemented")
					}
				}

				const requestId = `req_${nanoid()}`

				await tiny.request.publish({
					id: requestId,
					timestamp: new Date().toISOString(),
					source_id: source.publicId,
					workspace_id: source.workspaceId,
					body: String(body),
					headers: JSON.stringify(headers),
					validated: Number(verified.validated),
					rejected: Number(!verified.valid),
					version: "1.0",
				})

				if (!verified.validated || (verified.validated && verified.valid)) {
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
				}

				return {
					status: "SUCCESS",
					message: `Webhook handled by Hazel. Check your dashboard to inspect the request: https://app.hazelapp.dev/request/${requestId}`,
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
