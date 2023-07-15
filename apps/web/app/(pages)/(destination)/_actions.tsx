"use server"

import { createAction, protectedProcedure } from "@/server/trpc"
import db from "@/lib/db"

import { formSchema } from "./destination/new/schema"
import { z } from "zod"

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

export const deleteDestinationAction = createAction(
	protectedProcedure.input(z.string()).mutation(async (opts) => {
		await db.integration.markAsDeleted({
			publicId: opts.input,
		})
	}),
)
