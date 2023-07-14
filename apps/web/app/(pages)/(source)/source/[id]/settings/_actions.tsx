"use server"

import { createAction, protectedProcedure } from "@/server/trpc"
import db from "@/lib/db"
import { formSchema } from "@/app/(pages)/(source)/source/[id]/settings/schema"


export const editSourceAction = createAction(
	protectedProcedure.input(formSchema).mutation(async (opts) => {
		const integration = opts.input.integrationId ? await db.integration.getOne({
			publicId: opts.input.integrationId,
		}) : null

		const source = await db.source.update({
			integrationId: integration?.id,
			name: opts.input.name,
			url: opts.input.url,
			customerId: opts.ctx.auth.userId,
			publicId: opts.input.publicId,
		})

		return {
			id: source.publicId,
		}
	}),
)
