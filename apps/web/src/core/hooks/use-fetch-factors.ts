import { useSupabase } from "@hazel/supabase/hooks"

import useFactorsMutationKey from "@/core/hooks/use-user-factors-mutation-key"
import useQuery from "swr"

function useFetchAuthFactors() {
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

export default useFetchAuthFactors
