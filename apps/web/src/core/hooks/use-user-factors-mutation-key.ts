import { useAuth } from "@//lib/provider/AuthProvider"

/**
 * @returns {string[]} The key for the user's factors mutation. This is used to invalidate the query.
 */
function useFactorsMutationKey() {
	const session = useAuth()

	return ["mfa-factors", session.user?.id]
}

export default useFactorsMutationKey
