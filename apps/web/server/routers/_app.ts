import { z } from "zod"

import { publicProcedure, router } from "../trpc"
import { clerkClient } from "@clerk/nextjs"
import { emailRouter } from "./email"

export const getUser = publicProcedure
	.input(
		z.object({
			userId: z.string(),
		}),
	)
	.query(async (opts) => {
		return await clerkClient.users.getUser(opts.input.userId)
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
	email: emailRouter,
	getUser,
})

export type AppRouter = typeof appRouter
