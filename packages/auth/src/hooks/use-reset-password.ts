import { useSupabase } from "@hazel/supabase/hooks"
import useSWRMutation from "swr/mutation"

interface Params {
	email: string
	redirectTo: string
}

/**
 * @name useResetPassword
 */
function useResetPassword() {
	const client = useSupabase()
	const key = ["auth", "reset-password"]

	return useSWRMutation(key, (_, { arg: params }: { arg: Params }) => {
		return client.auth
			.resetPasswordForEmail(params.email, {
				redirectTo: params.redirectTo,
			})
			.then((result) => {
				if (result.error) {
					throw result.error
				}

				return result.data
			})
	})
}

export default useResetPassword
