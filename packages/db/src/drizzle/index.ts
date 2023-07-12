import { connect } from "@planetscale/database"
import { eq } from "drizzle-orm"
import { drizzle, PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless"

import { DrizzleTable } from "./orm/db-table"
import * as schema from "./schema"
import { generatePublicId } from "./schema/common"

import * as integrations from "./integrations"
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
		},
		integration: {
			table: new DrizzleTable("integration", schema.integration, db),
			getOne: async ({ publicId }: { publicId: string }) => {
				return await db.query.integration.findFirst({
					where: eq(schema.integration.publicId, publicId),
					with: {
						source: true,
					},
				})
			},
			getMany: async ({ customerId }: { customerId: string }) => {
				return await db.query.integration.findMany({
					where: eq(schema.integration.customerId, customerId),
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
		},
		integrationTool: {
			table: new DrizzleTable("integrationTool", schema.integrationTool, db),
			getOne: async ({ slug }: { slug: string }) => {
				return await db.query.integrationTool.findFirst({
					where: eq(schema.integrationTool.slug, slug),
				})
			},
			getMany: async () => {
				return await db.query.integrationTool.findMany({})
			},
			create: async (data: schema.InsertIntegrationTool) => {
				const res = await db.insert(schema.integrationTool).values(data)
				return { res }
			},
		},
	}
}
