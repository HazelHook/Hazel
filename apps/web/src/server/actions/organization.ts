"use server"

import { cookies } from "next/headers"
import { z } from "zod"

import db from "@/lib/db"
import { createOrgFormSchema, orgUpdateFormSchema } from "@/lib/schemas/organization"

import { createAction, protectedProcedure, basicProtectedProcedure, TRPCError } from "@hazel/server/actions/trpc"
import { generatePublicId } from "@hazel/db/src/drizzle/schema/common"
import * as schema from "@hazel/db/src/drizzle/schema"
import { createCustomer, createSubscription } from "@hazel/utils/lago"
import { getSupabaseServerActionClient } from "@hazel/supabase/clients"

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

		const res = await tx.insert(schema.organizations).values({ plan, name, ownerId: ownerId, publicId: orgId })

		await tx.insert(schema.organizationMembers).values({
			publicId: memberPublicId,
			userId: ownerId,
			organizationId: Number(res.insertId),
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

export const updateOrganizationProfileImageAction = createAction(
	protectedProcedure
		.input(z.object({ imageBuffer: z.string(), fileExt: z.enum(["jpg", "jpeg", "png", "gif", "svg"]) }))
		.mutation(async ({ input, ctx }) => {
			const client = getSupabaseServerActionClient({ admin: true })
			const buffer = Buffer.from(input.imageBuffer, "base64")

			const bucket = client.storage.from("org_avatars")
			const extension = input.fileExt
			const fileName = `${ctx.auth.workspaceId}.${extension}`

			const result = await bucket.upload(fileName, buffer, {
				upsert: true,
			})

			if (result.error) {
				throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: result.error.message })
			}

			await db.organization.update({
				publicId: ctx.auth.workspaceId,
				profileImage: bucket.getPublicUrl(fileName).data.publicUrl,
			})

			return {
				id: input,
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
