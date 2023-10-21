import { useSupabase } from "@hazel/supabase/hooks"
import { SignInWithOAuthCredentials } from "@supabase/supabase-js"
import useMutation from "swr/mutation"

/**
 * @name useSignInWithProvider
 */
export function useSignInWithProvider() {
	const client = useSupabase()
	const key = ["auth", "sign-in-with-provider"]

	return useMutation(key, async (_, { arg: credentials }: { arg: SignInWithOAuthCredentials }) => {
		console.log(credentials)
		return client.auth.signInWithOAuth(credentials).then((response) => {
			if (response.error) {
				throw response.error.message
			}

			return response.data
		})
	})
}
