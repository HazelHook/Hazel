import db from "@hazel/db"
import Elysia, { t } from "elysia"

import { authGuard } from "../../guard/auth-guard"

export const connectionRouter = (app: Elysia) =>
	app.use(authGuard).group("connections", (app) =>
		app
			.get(
				"/",
				async ({ workspace_id }) => {
					const connections = await db.connection.getMany({
						workspaceId: workspace_id,
					})
					return connections
				},
				{
					detail: {
						tags: ["Connections"],
						description: "Returns all Connections in your Workspace",
						responses: {
							"200": {
								description: "A list of Connections",
								content: {
									"application/json": {
										schema: {
											type: "array",
											items: {
												$ref: "#/components/schemas/Connection",
											},
										},
									},
								},
							},
						},
					},
				},
			)
			.post(
				"/",
				async ({ body, set, workspace_id }) => {
					const source = await db.source.getOne({
						publicId: body.publicSourceId,
					})

					const destination = await db.destination.getOne({
						publicId: body.publiceDestinationId,
					})

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
						workspaceId: workspace_id,
					})

					return {
						id: connection.publicId,
						name: body.name,
						sourceId: source.id,
						destinationId: destination.id,
						workspaceId: workspace_id,
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
					detail: {
						tags: ["Connections"],
						description: "Create a new Connection",
						responses: {
							"200": {
								description: "Details of the Connection",
								content: {
									"application/json": {
										schema: {
											type: "object",
											properties: {
												id: {
													type: "string",
												},
												name: {
													type: "string",
												},
												sourceId: {
													type: "string",
												},
												destinationId: {
													type: "string",
												},
												workspaceId: {
													type: "string",
												},
											},
											required: ["id", "name", "sourceId", "destinationId", "workspaceId"],
										},
									},
								},
							},
							"404": {
								description: "Connection not found",
							},
						},
					},
				},
			)
			.get(
				"/:id",
				async ({ params }) => {
					const connection = await db.connection.getOne({ publicId: params.id })
					return connection
				},
				{
					detail: {
						tags: ["Connections"],
						description: "Get a specific Connection",
						responses: {
							"200": {
								description: "A Connection",
								content: {
									"application/json": {
										schema: {
											$ref: "#/components/schemas/Connection",
										},
									},
								},
							},
							"404": {
								description: "Connection not found",
							},
						},
					},
				},
			)
			.put(
				"/:id",
				async ({ params, body }) => {
					const res = await db.connection.update({
						publicId: params.id,
						...body,
					})
					return res.publicId
				},
				{
					body: t.Object({
						name: t.Optional(t.String({ maxLength: 15, minLength: 3 })),
						url: t.Optional(t.String()),
					}),
					detail: {
						tags: ["Connections"],
						description: "Update a Connection by ID",
						responses: {
							"200": {
								description: "Connection ID",
								content: {
									"application/json": {
										schema: {
											type: "string",
										},
									},
								},
							},
						},
					},
				},
			)
			.delete(
				"/:id",
				async ({ params }) => {
					const res = await db.connection.delete({ publicId: params.id })
					return res.publicId
				},
				{
					detail: {
						tags: ["Connections"],
						description: "Delete a Connection by ID",
						responses: {
							"200": {
								description: "Delete Connection ID",
								content: {
									"application/json": {
										schema: {
											type: "string",
										},
									},
								},
							},
						},
					},
				},
			)
			.put(
				"/:id/pause",
				async ({ params }) => {
					await db.connection.update({
						publicId: params.id,
						enabled: false,
					})

					return params.id
				},
				{
					detail: {
						tags: ["Connections"],
						description: "Pause a Connection",
						responses: {
							"200": {
								description: "Paused Connection ID",
								content: {
									"application/json": {
										schema: {
											type: "string",
										},
									},
								},
							},
						},
					},
				},
			)
			.put(
				"/:id/unpause",
				async ({ params }) => {
					await db.connection.update({
						publicId: params.id,
						enabled: false,
					})

					return params.id
				},
				{
					detail: {
						tags: ["Connections"],
						description: "Unpause a Connection",
						responses: {
							"200": {
								description: "Unpaused Connection ID",
								content: {
									"application/json": {
										schema: {
											type: "string",
										},
									},
								},
							},
						},
					},
				},
			),
	)
