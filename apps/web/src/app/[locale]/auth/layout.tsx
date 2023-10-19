import { redirect } from "next/navigation"
import configuration from "@/configuration"
import { AuthPageShell } from "@hazel/auth"
import { checkSessionRequireMfa } from "@hazel/auth/utils"
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

	return (
		<AuthPageShell
			providers={configuration.auth.providers}
			config={{
				requireEmailConfirmation: configuration.auth.requireEmailConfirmation,
			}}
			paths={{
				signIn: configuration.paths.signIn,
				signUp: configuration.paths.signUp,
				signInRedirect: configuration.paths.home,
				signUpRedirect: configuration.paths.home,
				authCallback: configuration.paths.authCallback,
				onboarding: configuration.paths.onboarding,
			}}
		>
			{children}
		</AuthPageShell>
	)
}

export default AuthLayout
