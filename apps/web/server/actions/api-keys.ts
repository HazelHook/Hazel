"use server"

import { z } from "zod"
import { createAction, protectedProcedure } from "../trpc"
import db from "@/lib/db"
import { createApiKeySchema } from "@/lib/schemas/api-key"

export const createApiKeyAction = createAction(
	protectedProcedure.input(z.object({ workspaceId: z.string() }).merge(createApiKeySchema)).mutation(async (opts) => {
		const key = await db.apiKeys.create({
			...opts.input,
			ownerId: opts.ctx.auth.customerId,
		})

		return {
			id: key.publicId,
		}
	}),
)
