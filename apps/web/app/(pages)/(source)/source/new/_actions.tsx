"use server"

import { createAction, protectedProcedure } from "@/server/trpc"
import db from "@/lib/db"

import { formSchema } from "./schema"

/**
 * Either inline procedures using trpc's flexible
 * builder api, with input parsers and middleware
 * Wrap the procedure in a `createAction` call to
 * make it server-action friendly
 */
export const createSourceAction = createAction(
	protectedProcedure.input(formSchema).mutation(async (opts) => {
		const source = await db.source.create({
			name: opts.input.name,
			url: opts.input.url!,
			customerId: opts.ctx.auth.userId!,
		})

		return {
			id: source.publicId,
		}
	}),
)
