"use server"

import { createDestination } from "db/src/orm/destination"

import { createAction, protectedProcedure } from "@/server/trpc"
import { appConfig } from "@/lib/config"
import db from "@/lib/db"

import { formSchema } from "./schema"

export const createDestinationAction = createAction(
	protectedProcedure.input(formSchema).mutation(async (opts) => {
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
