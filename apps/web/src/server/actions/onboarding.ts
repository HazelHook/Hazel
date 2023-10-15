"use server"

import { z } from "zod"

import { basicProtectedProcedure, createAction } from "@//server/trpc"
import db from "@//lib/db"
import * as schema from "db/src/drizzle/schema"

import { cookies } from "next/headers"
import { generatePublicId } from "db/src/drizzle/schema/common"

const formSchema = z.object({
	organizationName: z.string().max(30),
})

export const handleOnboardingAction = createAction(
	basicProtectedProcedure.input(formSchema).mutation(async ({ ctx, input }) => {
		const publicId = generatePublicId("org")
		const memberPublicId = generatePublicId("mem")

		db.db.transaction(async (tx) => {
			await tx
				.insert(schema.user)
				.values({
					id: ctx.auth.customerId,
					onboarded: true,
				})
				.onConflictDoUpdate({
					target: schema.user.id,
					set: {
						id: ctx.auth.customerId,
						onboarded: true,
					},
				})

			const res = await tx
				.insert(schema.organizations)
				.values({ name: input.organizationName, ownerId: ctx.auth.customerId, publicId: publicId })
				.returning({ insertedId: schema.organizations.id })

			await tx.insert(schema.organizationMembers).values({
				publicId: memberPublicId,
				userId: ctx.auth.customerId,
				organizationId: Number(res[0].insertedId),
				role: "admin",
			})
		})

		cookies().set("membership_id", memberPublicId)

		return { success: true }
	}),
)
