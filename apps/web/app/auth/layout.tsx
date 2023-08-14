import initializeServerI18n from "@/i18n/i18n.server"
import AuthPageShell from "./components/AuthPageShell"
import getLanguageCookie from "@/i18n/get-language-cookie"
import getSupabaseServerClient from "@/core/supabase/server-client"
import { redirect } from "next/navigation"
import configuration from "@/configuration"

import verifyRequiresMfa from "@/core/session/utils/check-requires-mfa"

export const dynamic = "force-dynamic"

async function AuthLayout({ children }: React.PropsWithChildren) {
	const { language } = await initializeServerI18n(getLanguageCookie())
	const client = getSupabaseServerClient()

	const {
		data: { session },
	} = await client.auth.getSession()

	const requiresMultiFactorAuthentication = await verifyRequiresMfa(client)

	if (session && !requiresMultiFactorAuthentication) {
		redirect(configuration.paths.home)
	}

	return <AuthPageShell language={language}>{children}</AuthPageShell>
}

export default AuthLayout
