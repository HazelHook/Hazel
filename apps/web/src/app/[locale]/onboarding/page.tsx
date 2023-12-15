import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { requireSession } from "@hazel/auth/utils"
import { db } from "@hazel/db"
import { getSupabaseServerClient } from "@hazel/supabase/clients"
import configuration from "@hazel/utils/configuration"

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

// export const runtime = "edge"

export default OnboardingPage
