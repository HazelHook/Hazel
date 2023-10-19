import { redirect } from "next/navigation"
import configuration from "@/configuration"
import { Database } from "@/database.types"
import type { SupabaseClient } from "@supabase/supabase-js"
import { checkSessionRequireMfa } from "@hazel/auth/utils"

/**
 * @name requireSession
 * @description Require a session to be present in the request
 * @param client
 */
async function requireSession(client: SupabaseClient<Database>) {
	const { data, error } = await client.auth.getSession()

	if (!data.session || error) {
		return redirect(configuration.paths.signIn)
	}

	const requiresMfa = await checkSessionRequireMfa(client)

	// If the user requires multi-factor authentication,
	// redirect them to the page where they can verify their identity.
	if (requiresMfa) {
		return redirect(configuration.paths.signInMfa)
	}

	return data.session
}

export default requireSession
