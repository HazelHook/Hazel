import db from "@hazel/db"
import Elysia, { t } from "elysia"

import { authGuard } from "../../guard/auth-guard"

export const sourceRouter = (app: Elysia) =>
	app.use(authGuard).group("sources", (app) =>
		app
			.get("/", async ({ workspace_id }) => {
				const connections = await db.source.getMany({
					workspaceId: workspace_id,
				})
				return connections
			})
			.post(
				"/",
				async ({ body, workspace_id }) => {
					const connection = await db.source.create({
						name: body.name,
						workspaceId: workspace_id,
						key: body.key,
					})

					return {
						id: connection.publicId,
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
						url: t.Optional(t.String()),
					}),
				},
			)
			.get("/:id", async ({ params }) => {
				const connection = await db.source.getOne({ publicId: params.id })
				return connection
			})
			.put(
				"/:id",
				async ({ params, body }) => {
					const res = await db.source.update({ publicId: params.id, ...body })
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
				const res = await db.source.delete({ publicId: params.id })
				return res
			}),
	)
