import Elysia, { t } from "elysia"
import { authGuard } from "../guard/authGuard"

import db from "db/src/drizzle"

export const connectionRouter = (app: Elysia) =>
	app.use(authGuard)

	.group("connections", (app) =>
		app
			.get("/", async ({ workspace_id }) => {
				const connections = await db.connection.getMany({ customerId: workspace_id })
				return connections
			})
			.post(
				"/",
				async ({ body, set, workspace_id }) => {
					const source = await db.source.getOne({ publicId: body.publicSourceId })
					const destination = await db.destination.getOne({ publicId: body.publiceDestinationId })

					if (!destination) {
						set.status = 404

						return "Destination not found"
					}

					if (!source) {
						set.status = 404

						return "Source not found"
					}

					const connection = await db.connection.create({
						name: body.name,
						sourceId: source.id,
						destinationId: destination.id,
						customerId: workspace_id,
					})

					return {
						id: connection.publicId,
						name: body.name,
						sourceId: source.id,
						destinationId: destination.id,
						customerId: workspace_id,
					}
				},
				{
					body: t.Object({
						name: t.String({
							minLength: 2,
							maxLength: 3,
						}),
						publicSourceId: t.String({ maxLength: 21, minLength: 21 }),
						publiceDestinationId: t.String({ maxLength: 21, minLength: 21 }),
					}),
				},
			)
			.get("/:id", async ({ params }) => {
				const connection = await db.connection.getOne({ publicId: params.id })
				return connection
			})
			.put("/:id", () => {})
			.delete("/:id", async ({ params }) => {
				const res = await db.connection.markAsDeleted({ publicId: params.id })
				return res
			})
			.put("/:id/pause", async ({ params }) => {
				const res = await db.connection.update({ publicId: params.id, enabled: false })
				return res
			})
			.put("/:id/unpause", async ({ params }) => {
				const res = await db.connection.update({ publicId: params.id, enabled: false })
				return res
			}),
	)
