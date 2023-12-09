"use server"

import { createAction, protectedAdminProcedure, TRPCError } from "@hazel/server/actions/trpc"
import { getSupabaseServerActionClient } from "@hazel/supabase/clients"
import { z } from "zod"

export const impersonateUserAction = createAction(
	protectedAdminProcedure.input(z.object({ userId: z.string() })).mutation(async ({ input }) => {
		const client = getSupabaseServerActionClient({ admin: true })

		const {
			data: { user },
			error,
		} = await client.auth.admin.getUserById(input.userId)

		if (error || !user) {
			throw new TRPCError({
				message: "Error fetching user",
				code: "INTERNAL_SERVER_ERROR",
			})
		}

		const email = user.email

		if (!email) {
			throw new TRPCError({
				message: "User has no email. Cannot impersonate",
				code: "FORBIDDEN",
			})
		}

		const { error: linkError, data } = await client.auth.admin.generateLink({
			type: "magiclink",
			email,
			options: {
				redirectTo: "/",
			},
		})

		if (linkError || !data) {
			throw new TRPCError({
				message: "Error generating magic link",
				code: "INTERNAL_SERVER_ERROR",
			})
		}

		const response = await fetch(data.properties?.action_link, {
			method: "GET",
			redirect: "manual",
		})

		const location = response.headers.get("Location")

		if (!location) {
			throw new TRPCError({
				message: "Error generating magic link. Location header not found",
				code: "BAD_REQUEST",
			})
		}

		const hash = new URL(location).hash.substring(1)
		const query = new URLSearchParams(hash)
		const accessToken = query.get("access_token")
		const refreshToken = query.get("refresh_token")

		if (!accessToken || !refreshToken) {
			throw new TRPCError({
				message: "Error generating magic link. Tokens not found in URL hash.",
				code: "BAD_REQUEST",
			})
		}

		return {
			accessToken,
			refreshToken,
		}
	}),
)
