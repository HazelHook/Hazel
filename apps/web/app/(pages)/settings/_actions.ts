"use server"

import db from "@/lib/db"
import { createAction, protectedProcedure } from "@/server/trpc"
import { z } from "zod"

export const createApiKeyAction = createAction(
	protectedProcedure.input(z.object({ customerId: z.string() })).mutation(async (opts) => {
		const connection = await db.api.create({
			customerId: opts.input.customerId,
		})

		return {
			id: connection.publicId,
		}
	}),
)
