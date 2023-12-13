import db, { eq } from "@hazel/db"
import { WebhookVerifierFactory } from "@hazel/integrations"
import tiny from "@hazel/tinybird"
import { genId, getLogger } from "@hazel/utils"
import { Elysia } from "elysia"

import { ingestMetric } from "@hazel/utils/lago"
import { sendEvent } from "@hazel/backend-core"

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

				const source = await db.db.query.source.findFirst({
					where: (table) => eq(table.publicId, params.sourceId),
					with: {
						connections: {
							with: {
								destination: true,
							},
						},
						workspace: true,
						integration: true,
					},
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

				ingestMetric({ workspaceId: source.workspaceId, type: "requests" })

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

				const requestId = `req_${genId()}`

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
						if (!connection.enabled) {
							// TODO: Log it
							// TODO: Should be put in queue here for later when connection is resumed
							// => Or higher up the tree
							return
						}

						await sendEvent({
							request,
							body: String(body),
							connection: connection,
							requestId,
							workspaceId: source.workspaceId,
							sourceId: source.publicId,
							sourceKey: source.key,
							received_at,
							delay: connection.delay,
							signKey: source.workspace.secretKey,
						})
					}
				}

				return {
					status: "SUCCESS",
					message: `Webhook handled by Hazel. Check your dashboard to inspect the request: https://app.hazel.sh/request/${requestId}`,
					request_id: requestId,
				}
			}),
	)
