import { useCallback } from "react"
import { useSupabase } from "@hazel/supabase/hooks"

/**
 * @name useSignOut
 */
export function useSignOut() {
	const client = useSupabase()

	return useCallback(async () => {
		await client.auth.signOut()
	}, [client.auth])
}

export default useSignOut
