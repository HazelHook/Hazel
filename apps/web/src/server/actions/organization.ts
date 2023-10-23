"use server"

import { cookies } from "next/headers"
import { z } from "zod"

import db from "@/lib/db"
import { createOrgFormSchema, orgUpdateFormSchema } from "@/lib/schemas/organization"

import { createAction, protectedProcedure, basicProtectedProcedure, TRPCError } from "@hazel/server/actions/trpc"
import { generatePublicId } from "@hazel/db/src/drizzle/schema/common"
import * as schema from "@hazel/db/src/drizzle/schema"
import { createCustomer, createSubscription } from "@hazel/utils/lago"

export const createOrganzation = async ({
	plan = "free",
	name,
	primaryEmail,
	ownerId,
}: {
	plan: schema.Organization["plan"]
	name: string
	primaryEmail: string
	ownerId: string
}) => {
	const orgId = generatePublicId("org")
	const memberPublicId = generatePublicId("mem")

	const sub = await db.db.transaction(async (tx) => {
		await createCustomer({
			workspaceId: orgId,
			email: primaryEmail,
			name: name,
		})

		const sub = await createSubscription({
			planCode: plan!,
			workspaceId: orgId,
		})

		const res = await tx
			.insert(schema.organizations)
			.values({ plan, name, ownerId: ownerId, publicId: orgId })
			.returning({ insertedId: schema.organizations.id })

		await tx.insert(schema.organizationMembers).values({
			publicId: memberPublicId,
			userId: ownerId,
			organizationId: Number(res[0].insertedId),
			role: "admin",
		})

		return sub
	})

	return {
		subscription: sub,
		orgId,
		membershipId: memberPublicId,
	}
}

export const createOrganzationAction = createAction(
	basicProtectedProcedure.input(createOrgFormSchema).mutation(async ({ input, ctx }) => {
		return await createOrganzation({ ...input, primaryEmail: ctx.auth.user.email!, ownerId: ctx.auth.customerId })
	}),
)

export const updateOrganzationAction = createAction(
	protectedProcedure.input(z.object({ publicId: z.string() }).merge(orgUpdateFormSchema)).mutation(async (opts) => {
		const organization = await db.organization.update({
			...opts.input,
		})

		return {
			id: opts.input.publicId,
		}
	}),
)

export const deleteOrganzationAction = createAction(
	protectedProcedure.input(z.object({ publicId: z.string() })).mutation(async (opts) => {
		const organization = await db.organization.getOne({
			publicId: opts.input.publicId,
		})

		if (!organization) {
			throw new TRPCError({
				message: "Organization doesn't exist",
				code: "NOT_FOUND",
			})
		}
		if (organization.ownerId !== opts.ctx.auth.customerId) {
			throw new TRPCError({
				message: "Only the owner can delete the Organzation",
				code: "FORBIDDEN",
			})
		}

		if (organization.members.length > 1) {
			throw new TRPCError({
				message: "You can't delete an organization with active members",
				code: "FORBIDDEN",
			})
		}

		const deletedOrg = await db.organization.markAsDeleted({
			publicId: opts.input.publicId,
		})

		return {
			id: opts.input.publicId,
		}
	}),
)

export const switchOrganizationAction = createAction(
	basicProtectedProcedure.input(z.object({ publicId: z.string() })).mutation(async (opts) => {
		cookies().set("membership_id", opts.input.publicId)

		return {
			id: opts.input.publicId,
		}
	}),
)
