import { z } from "zod"

import { publicProcedure, router } from "../trpc"
import getSupabaseServerActionClient from "@/core/supabase/action-client"
import { TRPCError } from "@trpc/server"

export const getUser = publicProcedure
	.input(
		z.object({
			userId: z.string(),
		}),
	)
	.query(async (opts) => {
		const client = getSupabaseServerActionClient({ admin: true })
		const { data, error } = await client.auth.admin.getUserById(opts.input.userId)

		if (error || !data.user) {
			throw new TRPCError({ message: "NOT_FOUND", code: "NOT_FOUND" })
		}

		return data.user
	})

export const appRouter = router({
	greeting: publicProcedure
		.input(
			z.object({
				text: z.string(),
			}),
		)
		.query(async (opts) => {
			return `hello ${opts.input.text}`
		}),
	getUser,
})

export type AppRouter = typeof appRouter
