"use server"

import { createAction, protectedProcedure } from "@/server/trpc"
import { appConfig } from "@/lib/config"
import db from "@/lib/db"

import { formSchema } from "./schema"

export const createDestinationAction = createAction(
	protectedProcedure.input(formSchema).mutation(async (opts) => {
		const source = await db.destination.create({
			...opts.input,
			customerId: opts.ctx.auth.userId,
		})

		return {
			id: source.publicId,
		}
	}),
)
