"use server"

import { createDestination } from "db/src/orm/destination"

import { createAction, protectedProcedure } from "@/server/trpc"
import { appConfig } from "@/lib/config"
import db from "@/lib/db"

import { formSchema } from "./schema"

export const createDestinationAction = createAction(
	protectedProcedure.input(formSchema).mutation(async (opts) => {
		const source = await createDestination({
			data: { ...opts.input, customerId: opts.ctx.auth.userId },
			db,
		})

		return {
			id: source.publicId,
		}
	}),
)
