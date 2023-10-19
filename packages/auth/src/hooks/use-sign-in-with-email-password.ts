import { useSupabase } from "@hazel/supabase/hooks"
import useMutation from "swr/mutation"

interface Credentials {
	email: string
	password: string
}

/**
 * @name useSignInWithEmailPassword
 */
export function useSignInWithEmailPassword() {
	const client = useSupabase()
	const key = ["auth", "sign-in-with-email-password"]

	return useMutation(key, (_, { arg: credentials }: { arg: Credentials }) => {
		return client.auth.signInWithPassword(credentials).then((response) => {
			if (response.error) {
				throw response.error.message
			}

			return response.data
		})
	})
}
