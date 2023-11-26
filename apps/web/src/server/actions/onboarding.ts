"use server"

import { cookies } from "next/headers"
import { db } from "@hazel/db"
import * as schema from "@hazel/db/schema"
import { basicProtectedProcedure, createAction } from "@hazel/server/actions/trpc"
import { z } from "zod"

import { createOrganzation } from "./organization"

const formSchema = z.object({
	organizationName: z.string().max(30),
})

export const handleOnboardingAction = createAction(
	basicProtectedProcedure.input(formSchema).mutation(async ({ ctx, input }) => {
		const membershipId = await db.db.transaction(async (tx) => {
			const res = await createOrganzation({
				name: input.organizationName,
				plan: "free",
				primaryEmail: ctx.auth.user.email!,
				ownerId: ctx.auth.customerId,
			})

			await tx
				.insert(schema.user)
				.values({
					id: ctx.auth.customerId,
					onboarded: true,
				})
				.onDuplicateKeyUpdate({
					set: {
						id: ctx.auth.customerId,
						onboarded: true,
					},
				})

			return res.membershipId
		})

		cookies().set("membership_id", membershipId)

		return { success: true }
	}),
)
