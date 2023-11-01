"use server"

import { cookies } from "next/headers"
import * as schema from "@hazel/db/src/drizzle/schema"
import { z } from "zod"

import { createAction, basicProtectedProcedure } from "@hazel/server/actions/trpc"
import db from "@/lib/db"
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
