"use server"

import { createAction, protectedProcedure } from "@/server/trpc"
import db from "@/lib/db"
import { z } from "zod"

const formSchema = z.object({
	name: z.string(),
	tool: z.string(),
	config: z.any(),
})

export const createIntegrationAction = createAction(
	protectedProcedure.input(formSchema).mutation(async (opts) => {
		const integrationResult = await db.integration.create({
			customerId: opts.ctx.auth.userId,
			...opts.input,
		})

		return {
			id: integrationResult.publicId,
		}
	}),
)

export const deleteIntegrationAction = createAction(
	protectedProcedure.input(z.string()).mutation(async (opts) => {
		await db.integration.markAsDeleted({
			publicId: opts.input,
		})
	}),
)
