"use server"

import { createApiKeySchema } from "@/lib/schemas/api-key"

import { db } from "@hazel/db"
import { createAction, protectedProcedure } from "@hazel/server/actions/trpc"
import { z } from "zod"

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
