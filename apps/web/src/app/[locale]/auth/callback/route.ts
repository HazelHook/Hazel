import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"
import configuration from "@/configuration"
import getLogger from "@/core/logger"
import { Database } from "@/database.types"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function GET(request: NextRequest) {
	const requestUrl = new URL(request.url)
	const code = requestUrl.searchParams.get("code")

	const onError = (error?: string) => {
		redirect(`/auth/callback/error?error=${error}`)
	}

	if (code) {
		const client = createRouteHandlerClient<Database>({ cookies })

		try {
			const { error } = await client.auth.exchangeCodeForSession(code)

			if (error) {
				onError(error.message)
			}
		} catch (e) {
			getLogger().error("An error occurred while exchanging code for session", e)

			onError("An error occurred while signing user in")
		}
	}

	return redirect(configuration.paths.home)
}
