"use client"

import { ReactNode, useContext, useEffect, useState } from "react"
import UserSessionContext from "../contexts/auth"
import useSupabase from "@//core/hooks/use-supabase"
import { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

export const useAuth = () => useContext(UserSessionContext)

const AuthProvider = ({ children }: { children: ReactNode }) => {
	const supabase = useSupabase()
	const router = useRouter()

	const [user, setUser] = useState<User>()

	useEffect(() => {
		const { data } = supabase.auth.onAuthStateChange((event, session) => {
			switch (event) {
				case "INITIAL_SESSION":
				case "SIGNED_IN":
				case "USER_UPDATED":
					if (session) {
						setUser(session.user)
					}
					break
				case "SIGNED_OUT":
					setUser(undefined)
					router.refresh()
					break
				default:
					break
			}
		})
		return () => {
			data.subscription.unsubscribe()
		}
	}, [])

	return <UserSessionContext.Provider value={{ user, role: undefined }}>{children}</UserSessionContext.Provider>
}

export default AuthProvider
