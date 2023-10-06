import { DrizzleTable } from "../db-table"

import * as schema from "../../schema"
import { and, eq, isNull } from "drizzle-orm"
import { generatePublicId } from "../../schema/common"
import { DB, OptionalExceptFor } from ".."
import { EntityLogic } from "."

const organizationsLogic = (db: DB) =>
	({
		table: new DrizzleTable("organizations", schema.organizations, db),
		getOne: async ({
			publicId,
		}: {
			publicId: string
		}) => {
			return db.query.organizations.findFirst({
				where: and(eq(schema.organizations.publicId, publicId), isNull(schema.organizations.deletedAt)),
				with: {
					members: true,
					invites: true,
				},
			})
		},
		getMany: async ({
			ownerId,
		}: {
			ownerId: string
		}) => {
			return db.query.organizations.findMany({
				where: and(eq(schema.organizations.ownerId, ownerId), isNull(schema.organizations.deletedAt)),
				with: {
					members: true,
					invites: true,
				},
			})
		},
		create: async (data: Omit<schema.InsertOrganization, "publicId">) => {
			const publicId = generatePublicId("org")
			const memberPublicId = generatePublicId("mem")

			await db.transaction(async (tx) => {
				const res = await tx
					.insert(schema.organizations)
					.values({ ...data, publicId: publicId })
					.returning({ insertedId: schema.organizations.id })

				await tx.insert(schema.organizationMembers).values({
					publicId: memberPublicId,
					userId: data.ownerId,
					organizationId: Number(res[0].insertedId),
					role: "admin",
				})
			})

			return { publicId }
		},
		update: async (data: OptionalExceptFor<schema.InsertOrganization, "publicId">) => {
			const res = await db
				.update(schema.organizations)
				.set(data)
				.where(eq(schema.organizations.publicId, data.publicId))
			return { publicId: data.publicId }
		},
		markAsDeleted: async ({ publicId }: { publicId: string }) => {
			const res = await db
				.update(schema.organizations)
				.set({
					deletedAt: new Date(),
				})
				.where(eq(schema.organizations.publicId, publicId))
			return { publicId }
		},
		invite: {
			getMany: async ({
				orgId,
			}: {
				orgId: number
			}) => {
				const invites = db.query.organizationInvites.findMany({
					where: eq(schema.organizationInvites.organizationId, orgId),
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
			getOne: async ({
				membershipId,
			}: {
				membershipId: string
			}) => {
				const data = await db.query.organizationMembers.findFirst({
					where: eq(schema.organizationMembers.publicId, membershipId),
					with: {
						organization: true,
					},
				})

				if (!data || !data?.organization) {
					return null
				}

				return data
			},
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
					whereClause = eq(schema.organizationMembers.userId, customerId)
				} else if (orgId) {
					whereClause = eq(schema.organizationMembers.organizationId, orgId)
				}

				const memberShips = db.query.organizationMembers.findMany({
					where: and(whereClause, isNull(schema.organizationMembers.deletedAt)),
					with: {
						organization: true,
					},
				})
				return memberShips
			},
		},
	}) satisfies EntityLogic

export default organizationsLogic
