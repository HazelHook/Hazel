import { redirect } from "next/navigation"

import { getSupabaseServerClient } from "@hazel/supabase/clients"
import { checkSessionRequireMfa } from "../utils/check-requires-mfa"
import { VerifyFormContainer } from "../components/verify-form-container"

export type VerifyPaths = {
	signIn: string
	redirect: string
}

export async function VerifyPage({ paths }: { paths: VerifyPaths }) {
	const client = getSupabaseServerClient()
	const needsMfa = await checkSessionRequireMfa(client)

	if (!needsMfa) {
		redirect(paths.signIn)
	}

	return <VerifyFormContainer paths={paths} />
}
