import { headers } from "next/headers"
import { redirect } from "next/navigation"
import configuration from "@/configuration"
import getSupabaseServerClient from "@/core/supabase/server-client"

import db from "@/lib/db"
import requireSession from "@/lib/user/require-session"

import OnboardingContainer from "./components/OnboardingContainer"

const OnboardingPage = async () => {
	const client = getSupabaseServerClient()

	const csrfToken = headers().get("X-CSRF-Token")

	const session = await requireSession(client)

	const user = await db.user.getOne({ id: session.user.id })

	if (user?.onboarded) {
		redirect(configuration.paths.home)
	}

	return <OnboardingContainer csrfToken={csrfToken} />
}

export default OnboardingPage
