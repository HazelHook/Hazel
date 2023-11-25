"use server"

import { z } from "zod"

import { createAction, protectedProcedure } from "@hazel/server/actions/trpc"
import { db } from "@hazel/db"

const formSchema = z.object({
	tool: z.string(),
	config: z.any(),
})

export const createIntegrationAction = createAction(
	protectedProcedure
		.input(
			z.object({
				tool: z.string(),
				config: z.record(z.any()),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const integrationResult = await db.integration.create({
				workspaceId: ctx.auth.workspaceId,
				...input,
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
