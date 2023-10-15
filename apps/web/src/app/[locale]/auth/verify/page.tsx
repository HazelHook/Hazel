import { use } from "react"
import { redirect } from "next/navigation"

import verifyRequiresMfa from "@//core/session/utils/check-requires-mfa"
import getSupabaseServerClient from "@//core/supabase/server-client"
import VerifyFormContainer from "./components/VerifyFormContainer"

import configuration from "@//configuration"

export const metadata = {
	title: "Verify Authentication",
}

async function VerifyPage() {
	const client = getSupabaseServerClient()
	const needsMfa = await verifyRequiresMfa(client)

	if (!needsMfa) {
		redirect(configuration.paths.signIn)
	}

	return <VerifyFormContainer />
}

export default VerifyPage