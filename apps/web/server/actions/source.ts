"use server"

import { createAction, protectedProcedure } from "@/server/trpc"
import db from "@/lib/db"

import { createSourceSchema, updateSourceSchema } from "@/lib/schemas/source"

export const createSourceAction = createAction(
	protectedProcedure.input(createSourceSchema).mutation(async (opts) => {
		const integrationResult = opts.input.integrationId
			? await db.db.query.integration.findFirst({
					where: (integration, { eq }) => eq(integration.publicId, opts.input.integrationId as string),
			  })
			: undefined

		const source = await db.source.create({
			name: opts.input.name,
			url: opts.input.url!,
			integrationId: integrationResult?.id,
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
			url: opts.input.url,
			workspaceId: opts.ctx.auth.workspaceId,
			publicId: opts.input.publicId,
		})

		return {
			id: source.publicId,
		}
	}),
)
