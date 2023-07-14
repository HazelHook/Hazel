import { connect } from "@planetscale/database"
import { eq, isNull, and } from "drizzle-orm"
import { drizzle, PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless"

import { DrizzleTable } from "./orm/db-table"
import * as schema from "./schema"
import { generatePublicId } from "./schema/common"

import * as integrationsData from "./integrations/data"
export { integrationsData }

import * as integrations from "./integrations/common"
export { integrations }

export type DB = PlanetScaleDatabase<typeof schema>

export function connectDB({
	username,
	host,
	password,
}: {
	host: string
	username: string
	password: string
}) {
	const client = connect({
		username,
		host,
		password,
	})

	const db = drizzle(client, { schema })

	return {
		db,
		source: {
			table: new DrizzleTable("source", schema.source, db),
			getOne: async ({ publicId }: { publicId: string }) => {
				return await db.query.source.findFirst({
					where: eq(schema.source.publicId, publicId),
					with: {
						connections: {
							with: {
								destination: true,
							},
						},
						integration: true,
					},
				})
			},
			getMany: async ({ customerId }: { customerId: string }) => {
				return await db.query.source.findMany({
					where: eq(schema.source.customerId, customerId),
					with: {
						connections: {
							with: {
								destination: true,
							},
						},
						integration: true,
					},
				})
			},
			create: async (data: Omit<schema.InsertSource, "publicId">) => {
				const publicId = generatePublicId("src")
				const res = await db.insert(schema.source).values({
					...data,
					publicId,
				})

				return { res, publicId }
			},
			markAsDeleted: async ({ publicId }: { publicId: string }) => {
				const res = await db.update(schema.integration).set({
					deletedAt: new Date(),
				}).where(
					eq(schema.integration.publicId, publicId)
				)
				return { res }
			}
		},
		destination: {
			table: new DrizzleTable("destination", schema.destination, db),
			getOne: async ({ publicId }: { publicId: string }) => {
				return await db.query.destination.findFirst({
					where: eq(schema.destination.publicId, publicId),
				})
			},
			getMany: async ({ customerId }: { customerId: string }) => {
				return await db.query.destination.findMany({
					where: eq(schema.destination.customerId, customerId),
					with: {
						connections: {
							with: {
								source: true,
							},
						},
					},
				})
			},
			create: async (data: Omit<schema.InsertDestination, "publicId">) => {
				const publicId = generatePublicId("dst")
				const res = await db.insert(schema.destination).values({
					...data,
					publicId,
				})

				return { res, publicId }
			},
			markAsDeleted: async ({ publicId }: { publicId: string }) => {
				const res = await db.update(schema.integration).set({
					deletedAt: new Date(),
				}).where(
					eq(schema.integration.publicId, publicId)
				)
				return { res }
			}
		},
		connection: {
			table: new DrizzleTable("connection", schema.connection, db),
			getOne: async ({ publicId }: { publicId: string }) => {
				return await db.query.connection.findFirst({
					where: eq(schema.connection.publicId, publicId),
					with: {
						destination: true,
						source: true,
					},
				})
			},
			getMany: async ({ customerId }: { customerId: string }) => {
				return await db.query.connection.findMany({
					where: eq(schema.connection.customerId, customerId),
					with: {
						destination: true,
						source: true,
					},
				})
			},
			create: async (data: Omit<schema.InsertConnection, "publicId">) => {
				const publicId = generatePublicId("con")
				const res = await db.insert(schema.connection).values({
					...data,
					publicId,
				})
				return { res, publicId }
			},
			markAsDeleted: async ({ publicId }: { publicId: string }) => {
				const res = await db.update(schema.integration).set({
					deletedAt: new Date(),
				}).where(
					eq(schema.integration.publicId, publicId)
				)
				return { res }
			}
		},
		integration: {
			table: new DrizzleTable("integration", schema.integration, db),
			getOne: async ({ publicId, includeDeleted = false}: { publicId: string, includeDeleted?: boolean }) => {
				let filter
				if (!includeDeleted) {
					filter = and(
						eq(schema.integration.publicId, publicId),
						isNull(schema.integration.deletedAt)
					)
				} else{
					filter = eq(schema.integration.publicId, publicId)
				}

				return await db.query.integration.findFirst({
					where: filter,
					with: {
						source: true,
					},
				})
			},
			getMany: async ({ customerId, includeDeleted = false }: { customerId: string, includeDeleted?: boolean }) => {
				let filter
				if (!includeDeleted) {
					filter = and(
						eq(schema.integration.customerId, customerId),
						isNull(schema.integration.deletedAt)
					)
				} else{
					filter = eq(schema.integration.customerId, customerId)
				}

				return await db.query.integration.findMany({
					where: filter,
					with: {
						source: true,
					},
				})
			},
			create: async (data: Omit<schema.InsertIntegration, "publicId">) => {
				const publicId = generatePublicId("itg")
				const res = await db.insert(schema.integration).values({
					...data,
					publicId,
				})
				return { res, publicId }
			},
			markAsDeleted: async ({ publicId }: { publicId: string }) => {
				const res = await db.update(schema.integration).set({
					deletedAt: new Date(),
				}).where(
					eq(schema.integration.publicId, publicId)
				)
				return { res }
			}
		},
	}
}
