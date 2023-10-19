import { useSupabase } from "@hazel/supabase/hooks"

import useSWRMutation from "swr/mutation"
import { useAuthConfig } from "../provider/auth-config"

interface Credentials {
	email: string
	password: string
}

/**
 * @name useSignUpWithEmailAndPassword
 */
export function useSignUpWithEmailAndPassword() {
	const client = useSupabase()
	const authConfig = useAuthConfig()
	const key = ["auth", "sign-up-with-email-password"]

	return useSWRMutation(key, (_, { arg: credentials }: { arg: Credentials }) => {
		const emailRedirectTo = [window.location.origin, authConfig.paths.authCallback].join("")

		return client.auth
			.signUp({
				...credentials,
				options: {
					emailRedirectTo,
				},
			})
			.then((response) => {
				if (response.error) {
					throw response.error.message
				}

				return response.data
			})
	})
}
