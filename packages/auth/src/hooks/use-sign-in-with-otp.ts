import { useSupabase } from "@hazel/supabase/hooks"
import { AuthError, SignInWithPasswordlessCredentials } from "@hazel/supabase"
import useMutation from "swr/mutation"

/**
 * @name useSignInWithOtp
 */
export function useSignInWithOtp() {
	const client = useSupabase()
	const key = ["auth", "sign-in-with-otp"]

	return useMutation(key, (_, { arg: credentials }: { arg: SignInWithPasswordlessCredentials }) => {
		return client.auth.signInWithOtp(credentials).then((result) => {
			if (result.error) {
				if (shouldIgnoreError(result.error)) {
					console.warn(`Ignoring error during development: ${result.error.message}`)

					return {}
				}

				throw result.error.message
			}

			return result.data
		})
	})
}

function shouldIgnoreError(error: AuthError) {
	return process.env.NODE_ENV !== "production" && isSmsProviderNotSetupError(error)
}

function isSmsProviderNotSetupError(error: AuthError) {
	return error.message === "Error sending sms: sms Provider  could not be found"
}
