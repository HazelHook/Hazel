"use server"

import { createSource } from "db/src/orm/source"

import { createAction, publicProcedure } from "@/server/trpc"
import { appConfig } from "@/lib/config"
import db from "@/lib/db"

import { formSchema } from "./schema"
import { createDestination } from "db/src/orm/destination"

export const createDestinationAction = createAction(
	publicProcedure.input(formSchema).mutation(async (opts) => {
		console.log(opts.ctx.auth)
		const source = await createDestination({
			data: { ...opts.input, customerId: appConfig.devUser },
			db,
		})

		return {
			id: source.publicId,
		}
	}),
)
