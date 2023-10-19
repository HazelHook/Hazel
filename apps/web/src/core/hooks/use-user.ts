import { useRouter } from "next/navigation"
import { useSupabase } from "@hazel/supabase/hooks"
import useSWR from "swr"

/**
 * @name useUser
 */
function useUser() {
	const router = useRouter()
	const client = useSupabase()
	const key = "user"

	return useSWR([key], async () => {
		return client.auth
			.getUser()
			.then((result) => {
				if (result.error) {
					return Promise.reject(result.error)
				}

				if (result.data?.user) {
					return result.data.user
				}

				return Promise.reject("Unexpected result format")
			})
			.catch(() => {
				return router.refresh()
			})
	})
}

export default useUser
