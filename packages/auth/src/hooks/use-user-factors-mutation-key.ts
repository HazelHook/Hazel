import { useAuth } from "../provider"

/**
 * @returns {string[]} The key for the user's factors mutation. This is used to invalidate the query.
 */
export function useFactorsMutationKey() {
	const session = useAuth()

	return ["mfa-factors", session.user?.id]
}
