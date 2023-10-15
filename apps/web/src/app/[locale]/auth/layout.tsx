import AuthPageShell from "./components/AuthPageShell"
import getSupabaseServerClient from "@/core/supabase/server-client"
import { redirect } from "next/navigation"
import configuration from "@/configuration"
import {NextIntlClientProvider, useMessages} from 'next-intl';


import verifyRequiresMfa from "@/core/session/utils/check-requires-mfa"

export const dynamic = "force-dynamic"

async function AuthLayout({ children,params }: React.PropsWithChildren<{params: {locale:string}}>) {
	const client = getSupabaseServerClient()

	const {
		data: { session },
	} = await client.auth.getSession()

	const messages = useMessages();


	const requiresMultiFactorAuthentication = await verifyRequiresMfa(client)

	if (session && !requiresMultiFactorAuthentication) {
		redirect(configuration.paths.home)
	}

	return (
		<NextIntlClientProvider locale={params.locale} messages={messages}>
			<AuthPageShell>{children}</AuthPageShell>
		</NextIntlClientProvider>
	)
}

export default AuthLayout
