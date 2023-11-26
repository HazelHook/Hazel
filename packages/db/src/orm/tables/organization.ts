import { eq, } from "drizzle-orm"

import { EntityLogic } from "."
import { DB, OptionalExceptFor } from ".."
import * as schema from "../../schema"
import { generatePublicId } from "../../schema/common"
import { DrizzleTable } from "../db-table"

const organizationsLogic = (db: DB) =>
	({
		table: new DrizzleTable("organizations", schema.organizations, db),
		getOne: async ({ publicId }: { publicId: string }) => {
			return db.query.organizations.findFirst({
				where: eq(schema.organizations.publicId, publicId),
				with: {
					members: true,
					invites: true,
				},
			})
		},
		getMany: async ({ ownerId }: { ownerId: string }) => {
			return db.query.organizations.findMany({
				where: eq(schema.organizations.ownerId, ownerId),
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
				const res = await tx.insert(schema.organizations).values({ ...data, publicId: publicId })

				await tx.insert(schema.organizationMembers).values({
					publicId: memberPublicId,
					userId: data.ownerId,
					organizationId: Number(res.insertId),
					role: "admin",
				})
			})

			return { publicId }
		},
		update: async (data: OptionalExceptFor<schema.Organization, "publicId">) => {
			const res = await db
				.update(schema.organizations)
				.set(data)
				.where(eq(schema.organizations.publicId, data.publicId))
			return { publicId: data.publicId }
		},
		delete: async ({ publicId }: { publicId: string }) => {
			const res = await db.delete(schema.organizations)

			.where(eq(schema.organizations.publicId, publicId))
			return { publicId }
		},
		invite: {
			get: async ({ publicId }: { publicId: string }) => {
				const invite = db.query.organizationInvites.findFirst({
					where: eq(schema.organizationInvites.publicId, publicId),
					with: {
						organization: true,
					},
				})

				return invite
			},
			getMany: async ({ orgId }: { orgId: number }) => {
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
			create: async (data: Omit<schema.InsertOrganizationMember, "publicId">) => {
				const publicId = generatePublicId("mem")
				const res = await db.insert(schema.organizationMembers).values({
					...data,
					publicId,
				})
				return { res, publicId }
			},
			getOne: async ({ membershipId }: { membershipId: string }) => {
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
					where: whereClause,
					with: {
						organization: true,
						user: true,
					},
				})
				return memberShips
			},
		},
	}) satisfies EntityLogic

export default organizationsLogic
