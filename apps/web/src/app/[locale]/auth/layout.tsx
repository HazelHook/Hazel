import { redirect } from "next/navigation"
import configuration from "@/configuration"
import { checkSessionRequireMfa } from "@hazel/auth/utils"

import AuthPageShell from "./components/AuthPageShell"
import { getSupabaseServerClient } from "@hazel/supabase/clients"

export const dynamic = "force-dynamic"

async function AuthLayout({ children }: React.PropsWithChildren) {
	const client = getSupabaseServerClient()

	const {
		data: { session },
	} = await client.auth.getSession()

	const requiresMultiFactorAuthentication = await checkSessionRequireMfa(client)

	if (session && !requiresMultiFactorAuthentication) {
		redirect(configuration.paths.home)
	}

	return <AuthPageShell>{children}</AuthPageShell>
}

export default AuthLayout
