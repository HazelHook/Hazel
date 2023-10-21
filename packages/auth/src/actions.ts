import { getSupabaseServerActionClient } from "@hazel/supabase/clients"

import { createAction } from "@hazel/server/actions/trpc"

export const impersonateUser = createAction(async ({ userId }) => {
	const client = getSupabaseServerActionClient({ admin: true })

	const {
		data: { user },
		error,
	} = await client.auth.admin.getUserById(userId)

	if (error || !user) {
		throw new Error("Error fetching user")
	}

	const email = user.email

	if (!email) {
		throw new Error("User has no email. Cannot impersonate")
	}

	const { error: linkError, data } = await client.auth.admin.generateLink({
		type: "magiclink",
		email,
		options: {
			redirectTo: "/",
		},
	})

	if (linkError || !data) {
		throw new Error("Error generating magic link")
	}

	const response = await fetch(data.properties?.action_link, {
		method: "GET",
		redirect: "manual",
	})

	const location = response.headers.get("Location")

	if (!location) {
		throw new Error("Error generating magic link. Location header not found")
	}

	const hash = new URL(location).hash.substring(1)
	const query = new URLSearchParams(hash)
	const accessToken = query.get("access_token")
	const refreshToken = query.get("refresh_token")

	if (!accessToken || !refreshToken) {
		throw new Error("Error generating magic link. Tokens not found in URL hash.")
	}

	return {
		accessToken,
		refreshToken,
	}
})
