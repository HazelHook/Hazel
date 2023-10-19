"use client"

import { ReactNode, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@hazel/supabase/hooks"

import { User } from "@supabase/supabase-js"

import { createContext } from "react"
import { OrganizationMember } from "@hazel/db/src/drizzle"

interface UserSession {
	user: Maybe<User>
	role: Maybe<OrganizationMember["role"]>
}

export const UserSessionContext = createContext<UserSession>({
	user: undefined,
	role: undefined,
})

export const useAuth = () => useContext(UserSessionContext)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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
