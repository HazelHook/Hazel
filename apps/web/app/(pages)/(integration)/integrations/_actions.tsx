"use server"

import { createAction, protectedProcedure } from "@/server/trpc"
import db from "@/lib/db"
import { z } from "zod"

export const createIntegrationAction = createAction(
	protectedProcedure.input(z.object({
        name: z.string(),
        data: z.unknown()
    })).mutation(async (opts) => {
		(opts as any).input.data['name'] = undefined
		const integration = await db.integration.create({
			customerId: opts.ctx.auth.userId!,
            name: opts.input.name,
            config: opts.input.data,
		})

		return {
			id: integration.publicId,
		}
	}),
)
