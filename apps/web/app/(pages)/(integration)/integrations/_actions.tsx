"use server"

import { createAction, protectedProcedure } from "@/server/trpc"
import db from "@/lib/db"
import { z } from "zod"

const formSchema = z.object({
	name: z.string(),
	config: z.any()
})

/**
 * Either inline procedures using trpc's flexible
 * builder api, with input parsers and middleware
 * Wrap the procedure in a `createAction` call to
 * make it server-action friendly
 */
export const createIntegrationAction = createAction(
	protectedProcedure.input(formSchema).mutation(async (opts) => {
		const integrationResult = await db.integration.create({
			customerId: opts.ctx.auth.userId,
			...opts.input
		})

		return {
			id: integrationResult.publicId,
		}
	}),
)
