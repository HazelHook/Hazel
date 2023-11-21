"use server"

import { z } from "zod"

import { createAction, protectedProcedure } from "@hazel/server/actions/trpc"
import { db } from "@hazel/db"

const formSchema = z.object({
	name: z.string(),
	tool: z.string(),
	config: z.any(),
})

export const createIntegrationAction = createAction(
	protectedProcedure.input(formSchema).mutation(async (opts) => {
		const integrationResult = await db.integration.create({
			workspaceId: opts.ctx.auth.workspaceId,
			...opts.input,
		})

		return {
			id: integrationResult.publicId,
		}
	}),
)

export const updateIntegrationAction = createAction(
	protectedProcedure.input(formSchema.merge(z.object({ publicId: z.string() }))).mutation(async (opts) => {
		const integrationResult = await db.integration.update(opts.input)

		return { id: integrationResult.publicId }
	}),
)

export const deleteIntegrationAction = createAction(
	protectedProcedure.input(z.string()).mutation(async (opts) => {
		await db.integration.delete({
			publicId: opts.input,
		})
	}),
)
