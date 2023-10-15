import AuthPageShell from "./components/AuthPageShell"
import getSupabaseServerClient from "@//core/supabase/server-client"
import { redirect } from "next/navigation"
import configuration from "@//configuration"

import verifyRequiresMfa from "@//core/session/utils/check-requires-mfa"
import { I18Provider } from "@//components/i18-provider"

export const dynamic = "force-dynamic"

async function AuthLayout({ children }: React.PropsWithChildren) {
	const client = getSupabaseServerClient()

	const {
		data: { session },
	} = await client.auth.getSession()

	const requiresMultiFactorAuthentication = await verifyRequiresMfa(client)

	if (session && !requiresMultiFactorAuthentication) {
		redirect(configuration.paths.home)
	}

	return (
		<I18Provider>
			<AuthPageShell>{children}</AuthPageShell>
		</I18Provider>
	)
}

export default AuthLayout
