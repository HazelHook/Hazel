import { createContext } from "react"
import { User } from "@supabase/supabase-js"
import { OrganizationMember } from "db/src/drizzle"

interface UserSession {
	user: Maybe<User>
	role: Maybe<OrganizationMember["role"]>
}

interface UserData {
	id: string
	photoUrl?: string
	displayName?: string
	onboarded: boolean
}

const UserSessionContext = createContext<UserSession>({
	user: undefined,
	role: undefined,
})

export default UserSessionContext
