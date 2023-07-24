"use server"

import { z } from "zod"
import { createAction, protectedProcedure } from "../trpc"
import db from "@/lib/db"

export const createApiKeyAction = createAction(
	protectedProcedure.input(z.object({ workspaceId: z.string() })).mutation(async (opts) => {
		const connection = await db.api.create({
			workspaceId: opts.input.workspaceId,
		})

		return {
			id: connection.publicId,
		}
	}),
)
