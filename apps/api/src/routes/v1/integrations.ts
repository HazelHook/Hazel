import db from "db/src/drizzle"
import Elysia, { t } from "elysia"

import { authGuard } from "../../guard/authGuard"

export const integrationRouter = (app: Elysia) =>
	app.use(authGuard).group("sources", (app) =>
		app
			.get("/", async ({ workspace_id }) => {
				const integrations = await db.integration.getMany({
					customerId: workspace_id,
				})
				return integrations
			})
			.get("/:id", async ({ params }) => {
				const integration = await db.integration.getOne({
					publicId: params.id,
				})
				return integration
			})
			.put(
				"/:id",
				async ({ params, body }) => {
					const res = await db.integration.update({
						publicId: params.id,
						...body,
					})
					return res
				},
				{
					body: t.Object({
						name: t.Optional(t.String({ maxLength: 15, minLength: 3 })),
						config: t.Any(),
					}),
				},
			)
			.delete("/:id", async ({ params }) => {
				const res = await db.integration.markAsDeleted({ publicId: params.id })
				return res
			}),
	)
