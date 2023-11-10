import db from "@hazel/db"
import Elysia, { t } from "elysia"

import { authGuard } from "../../guard/authGuard"

export const destinationRouter = (app: Elysia) =>
	app.use(authGuard).group("sources", (app) =>
		app
			.get("/", async ({ workspace_id }) => {
				const destination = await db.destination.getMany({
					workspaceId: workspace_id,
				})
				return destination
			})
			.post(
				"/",
				async ({ body, workspace_id }) => {
					const destination = await db.destination.create({
						name: body.name,
						url: body.url,
						workspaceId: workspace_id,
						key: body.key,
					})

					return {
						id: destination.publicId,
						name: body.name,
						url: body.url,
						workspaceId: workspace_id,
					}
				},
				{
					body: t.Object({
						name: t.String({
							minLength: 2,
							maxLength: 16,
						}),
						key: t.String({
							minLength: 2,
							maxLength: 12,
						}),
						url: t.String(),
					}),
				},
			)
			.get("/:id", async ({ params }) => {
				const destination = await db.destination.getOne({
					publicId: params.id,
				})
				return destination
			})
			.put(
				"/:id",
				async ({ params, body }) => {
					const res = await db.destination.update({
						publicId: params.id,
						...body,
					})
					return res
				},
				{
					body: t.Object({
						name: t.Optional(t.String({ maxLength: 15, minLength: 3 })),
						url: t.Optional(t.String()),
					}),
				},
			)
			.delete("/:id", async ({ params }) => {
				const res = await db.destination.markAsDeleted({ publicId: params.id })
				return res
			}),
	)
