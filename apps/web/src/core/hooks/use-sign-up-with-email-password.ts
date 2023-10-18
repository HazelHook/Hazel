import configuration from "@/configuration"
import { useSupabase } from "@hazel/supabase/hooks/index"
import useSWRMutation from "swr/mutation"

interface Credentials {
	email: string
	password: string
}

/**
 * @name useSignUpWithEmailAndPassword
 */
function useSignUpWithEmailAndPassword() {
	const client = useSupabase()
	const key = ["auth", "sign-up-with-email-password"]

	return useSWRMutation(key, (_, { arg: credentials }: { arg: Credentials }) => {
		const emailRedirectTo = [window.location.origin, configuration.paths.authCallback].join("")

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

export default useSignUpWithEmailAndPassword
