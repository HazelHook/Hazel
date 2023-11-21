"use server"

import { createAction, protectedProcedure } from "@hazel/server/actions/trpc"

import { db } from "@hazel/db"
import { createSourceSchema, updateSourceSchema } from "@/lib/schemas/source"
import { z } from "zod"

export const createSourceAction = createAction(
	protectedProcedure.input(createSourceSchema).mutation(async (opts) => {
		const integrationResult = opts.input.integrationId
			? await db.db.query.integration.findFirst({
					where: (integration, { eq }) => eq(integration.publicId, opts.input.integrationId as string),
			  })
			: undefined

		const source = await db.source.create({
			name: opts.input.name,
			integrationId: integrationResult?.id,
			key: opts.input.key,
			workspaceId: opts.ctx.auth.workspaceId,
		})

		return {
			id: source.publicId,
		}
	}),
)

export const updateSourceAction = createAction(
	protectedProcedure.input(updateSourceSchema).mutation(async (opts) => {
		const integration = opts.input.integrationId
			? await db.integration.getOne({
					publicId: opts.input.integrationId,
			  })
			: null

		const source = await db.source.update({
			integrationId: integration?.id,
			name: opts.input.name,
			workspaceId: opts.ctx.auth.workspaceId,
			publicId: opts.input.publicId,
		})

		return {
			id: source.publicId,
		}
	}),
)

export const deleteSourceAction = createAction(
	protectedProcedure.input(z.string()).mutation(async (opts) => {
		await db.source.delete({
			publicId: opts.input,
		})
	}),
)
