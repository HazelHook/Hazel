import { useSupabase } from "@hazel/supabase/hooks"

import useQuery from "swr"
import { useFactorsMutationKey } from "./use-user-factors-mutation-key"

export function useFetchAuthFactors() {
	const client = useSupabase()
	const key = useFactorsMutationKey()

	return useQuery(key, async () => {
		const { data, error } = await client.auth.mfa.listFactors()

		if (error) {
			throw error
		}

		return data
	})
}
