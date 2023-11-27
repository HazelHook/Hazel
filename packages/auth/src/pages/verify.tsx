import { redirect } from "next/navigation"

import { getSupabaseServerClient } from "@hazel/supabase/clients"

import { VerifyFormContainer } from "../internal-components/verify-form-container"
import { checkSessionRequireMfa } from "../utils/check-requires-mfa"

export async function VerifyPage({
	signInPath,
	signInRedirectPath,
}: {
	signInPath: string
	signInRedirectPath: string
}) {
	const client = getSupabaseServerClient()
	const needsMfa = await checkSessionRequireMfa(client)

	if (!needsMfa) {
		redirect(signInPath)
	}

	return <VerifyFormContainer redirectPath={signInRedirectPath} />
}
