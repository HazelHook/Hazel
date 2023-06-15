"use server"

import { createSource } from "db/src/orm/source"

import { createAction, publicProcedure } from "@/server/trpc"
import { appConfig } from "@/lib/config"
import db from "@/lib/db"

import { formSchema } from "./schema"

/**
 * Either inline procedures using trpc's flexible
 * builder api, with input parsers and middleware
 * Wrap the procedure in a `createAction` call to
 * make it server-action friendly
 */
export const createSourceAction = createAction(
	publicProcedure.input(formSchema).mutation(async (opts) => {
		console.log(opts.ctx.auth)
		const source = await createSource({
			data: { ...opts.input, customerId: appConfig.devUser },
			db,
		})

		return {
			id: source.publicId,
		}
	}),
)
