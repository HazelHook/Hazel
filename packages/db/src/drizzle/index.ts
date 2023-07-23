import { connect } from "@planetscale/database"
import { and, eq, isNull } from "drizzle-orm"
import { drizzle, PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless"

import * as integrations from "./integrations/common"
import * as integrationsData from "./integrations/data"
import { DrizzleTable } from "./orm/db-table"
import * as schema from "./schema"
import { generatePublicId } from "./schema/common"

export { integrationsData }

export { integrations }

export type DB = PlanetScaleDatabase<typeof schema>

export type OptionalExceptFor<T, K extends keyof T> = Partial<T> & Pick<T, K>

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
			getOne: async ({
				publicId,
				includeDeleted,
			}: {
				publicId: string
				includeDeleted?: boolean
			}) => {
				let filter
				if (!includeDeleted) {
					filter = and(eq(schema.source.publicId, publicId), isNull(schema.source.deletedAt))
				} else {
					filter = eq(schema.source.publicId, publicId)
				}

				return db.query.source.findFirst({
					where: filter,
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
			getMany: async ({
				workspaceId,
				includeDeleted,
			}: {
				workspaceId: string
				includeDeleted?: boolean
			}) => {
				let filter
				if (!includeDeleted) {
					filter = and(eq(schema.source.workspaceId, workspaceId), isNull(schema.source.deletedAt))
				} else {
					filter = eq(schema.source.workspaceId, workspaceId)
				}

				return await db.query.source.findMany({
					where: filter,
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
			update: async (data: OptionalExceptFor<schema.InsertSource, "publicId">) => {
				const { publicId, ...rest } = data
				const res = await db.update(schema.source).set(rest).where(eq(schema.source.publicId, publicId))

				return { res, publicId }
			},
			markAsDeleted: async ({ publicId }: { publicId: string }) => {
				const res = await db
					.update(schema.source)
					.set({
						deletedAt: new Date(),
					})
					.where(eq(schema.source.publicId, publicId))
				return { res }
			},
		},
		destination: {
			table: new DrizzleTable("destination", schema.destination, db),
			getOne: async ({
				publicId,
				includeDeleted,
			}: {
				publicId: string
				includeDeleted?: boolean
			}) => {
				let filter
				if (!includeDeleted) {
					filter = and(eq(schema.destination.publicId, publicId), isNull(schema.destination.deletedAt))
				} else {
					filter = eq(schema.destination.publicId, publicId)
				}

				return await db.query.destination.findFirst({
					where: filter,
				})
			},
			getMany: async ({
				workspaceId,
				includeDeleted,
			}: {
				workspaceId: string
				includeDeleted?: boolean
			}) => {
				let filter
				if (!includeDeleted) {
					filter = and(eq(schema.destination.workspaceId, workspaceId), isNull(schema.destination.deletedAt))
				} else {
					filter = eq(schema.destination.workspaceId, workspaceId)
				}

				return await db.query.destination.findMany({
					where: filter,
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
			update: async (data: OptionalExceptFor<schema.InsertDestination, "publicId">) => {
				const { publicId, ...rest } = data
				const res = await db.update(schema.destination).set(rest).where(eq(schema.destination.publicId, publicId))

				return { res, publicId }
			},
			markAsDeleted: async ({ publicId }: { publicId: string }) => {
				const res = await db
					.update(schema.destination)
					.set({
						deletedAt: new Date(),
					})
					.where(eq(schema.destination.publicId, publicId))
				return { res }
			},
		},
		connection: {
			table: new DrizzleTable("connection", schema.connection, db),
			getOne: async ({
				publicId,
				includeDeleted,
			}: {
				publicId: string
				includeDeleted?: boolean
			}) => {
				let filter
				if (!includeDeleted) {
					filter = and(eq(schema.connection.publicId, publicId), isNull(schema.connection.deletedAt))
				} else {
					filter = eq(schema.connection.publicId, publicId)
				}

				return await db.query.connection.findFirst({
					where: filter,
					with: {
						destination: true,
						source: true,
					},
				})
			},
			getMany: async ({
				workspaceId,
				includeDeleted,
			}: {
				workspaceId: string
				includeDeleted?: boolean
			}) => {
				let filter
				if (!includeDeleted) {
					filter = and(eq(schema.connection.workspaceId, workspaceId), isNull(schema.connection.deletedAt))
				} else {
					filter = eq(schema.connection.workspaceId, workspaceId)
				}

				return await db.query.connection.findMany({
					where: filter,
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
			update: async (data: OptionalExceptFor<schema.InsertConnection, "publicId">) => {
				const { publicId, ...rest } = data
				const res = await db.update(schema.connection).set(rest).where(eq(schema.connection.publicId, publicId))
				return { res, publicId }
			},
			markAsDeleted: async ({ publicId }: { publicId: string }) => {
				const res = await db
					.update(schema.connection)
					.set({
						deletedAt: new Date(),
					})
					.where(eq(schema.connection.publicId, publicId))
				return { res }
			},
		},
		integration: {
			table: new DrizzleTable("integration", schema.integration, db),
			getOne: async ({
				publicId,
				includeDeleted = false,
			}: {
				publicId: string
				includeDeleted?: boolean
			}) => {
				let filter
				if (!includeDeleted) {
					filter = and(eq(schema.integration.publicId, publicId), isNull(schema.integration.deletedAt))
				} else {
					filter = eq(schema.integration.publicId, publicId)
				}

				return await db.query.integration.findFirst({
					where: filter,
					with: {
						source: true,
					},
				})
			},
			getMany: async ({
				workspaceId,
				includeDeleted = false,
			}: {
				workspaceId: string
				includeDeleted?: boolean
			}) => {
				let filter
				if (!includeDeleted) {
					filter = and(eq(schema.integration.workspaceId, workspaceId), isNull(schema.integration.deletedAt))
				} else {
					filter = eq(schema.integration.workspaceId, workspaceId)
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
			update: async (data: OptionalExceptFor<Omit<schema.InsertIntegration, "workspaceId">, "publicId">) => {
				const res = await db.update(schema.integration).set(data).where(eq(schema.integration.publicId, data.publicId))
				return { res }
			},
			markAsDeleted: async ({ publicId }: { publicId: string }) => {
				const res = await db
					.update(schema.integration)
					.set({
						deletedAt: new Date(),
					})
					.where(eq(schema.integration.publicId, publicId))
				return { res }
			},
		},
		api: {
			getOne: async ({
				publicId,
			}: {
				publicId: string
			}) => {
				return await db.query.apiKeys.findFirst({
					where: and(eq(schema.apiKeys.publicId, publicId), isNull(schema.apiKeys.deletedAt)),
				})
			},
			getMany: async ({
				workspaceId,
				includeDeleted = false,
			}: {
				workspaceId: string
				includeDeleted?: boolean
			}) => {
				let filter
				if (!includeDeleted) {
					filter = and(eq(schema.apiKeys.workspaceId, workspaceId), isNull(schema.apiKeys.deletedAt))
				} else {
					filter = eq(schema.apiKeys.workspaceId, workspaceId)
				}

				return await db.query.apiKeys.findMany({
					where: filter,
				})
			},
			create: async (data: Omit<schema.InsertApiKey, "publicId">) => {
				const publicId = generatePublicId("sk")
				const res = await db.insert(schema.apiKeys).values({
					...data,
					publicId,
				})
				return { res, publicId }
			},
			update: async (data: OptionalExceptFor<Omit<schema.InsertApiKey, "customerId">, "publicId">) => {
				const res = await db.update(schema.apiKeys).set(data).where(eq(schema.apiKeys.publicId, data.publicId))
				return { res }
			},
			markAsDeleted: async ({ publicId }: { publicId: string }) => {
				const res = await db
					.update(schema.apiKeys)
					.set({
						deletedAt: new Date(),
					})
					.where(eq(schema.apiKeys.publicId, publicId))
				return { res }
			},
		},
		organization: {
			getOne: async ({
				slug,
			}: {
				slug: string
			}) => {
				return db.query.organizations.findFirst({
					where: and(eq(schema.organizations.slug, slug), isNull(schema.organizations.deletedAt)),
					with: {
						members: true,
						invites: true,
					},
				})
			},
			getPersonal: async ({
				customerId,
			}: {
				customerId: string
			}) => {
				const data = await db.query.organizationMembers.findFirst({
					where: and(
						eq(schema.organizationMembers.customerId, customerId),
						eq(schema.organizationMembers.personal, true),
					),
					with: {
						organization: true,
					},
				})

				if (!data || !data?.organization) {
					return null
				}

				return data.organization
			},
			create: async (data: Omit<schema.InsertOrganization, "publicId">) => {
				const publicId = generatePublicId("org")
				const res = await db.insert(schema.organizations).values({
					...data,
					publicId,
				})
				return { res, publicId }
			},
			update: async (data: OptionalExceptFor<schema.InsertOrganization, "publicId">) => {
				const res = await db
					.update(schema.organizations)
					.set(data)
					.where(eq(schema.organizations.publicId, data.publicId))
				return { res }
			},
			markAsDeleted: async ({ publicId }: { publicId: string }) => {
				const res = await db
					.update(schema.organizations)
					.set({
						deletedAt: new Date(),
					})
					.where(eq(schema.organizations.publicId, publicId))
				return { res }
			},
			invite: {
				getMany: async ({
					orgId,
				}: {
					orgId: number
				}) => {
					const invites = db.query.organizationInvites.findMany({
						where: and(
							eq(schema.organizationInvites.organizationId, orgId),
							isNull(schema.organizationMembers.deletedAt),
						),
					})

					return invites
				},
				create: async (data: Omit<schema.InsertOrganizationInvite, "publicId">) => {
					const publicId = generatePublicId("inv")
					const res = await db.insert(schema.organizationInvites).values({
						...data,
						publicId,
					})
					return { res, publicId }
				},
				revoke: async (data: { publicInviteId: string }) => {
					const publicId = generatePublicId("inv")
					const res = await db
						.delete(schema.organizationInvites)
						.where(eq(schema.organizationInvites.publicId, data.publicInviteId))

					return { res, publicId }
				},
			},
			memberships: {
				getMany: async ({
					customerId,
					orgId,
				}: {
					customerId?: string
					orgId?: number
				}) => {
					if (!customerId && !orgId) {
						throw new Error("Either customerId or organizationId must be provided.")
					}

					let whereClause

					if (customerId) {
						whereClause = eq(schema.organizationMembers.customerId, customerId)
					} else if (orgId) {
						whereClause = eq(schema.organizationMembers.organizationId, orgId)
					}

					const memberShips = db.query.organizationMembers.findMany({
						where: and(whereClause, isNull(schema.organizationMembers.deletedAt)),
					})
					return memberShips
				},
			},
		},
	}
}

export default connectDB({
	host: process.env.PLANETSCALE_DB_HOST as string,
	username: process.env.PLANETSCALE_DB_USERNAME as string,
	password: process.env.PLANETSCALE_DB_PASSWORD as string,
})
