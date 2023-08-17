import "server-only"

import { redirect } from "next/navigation"

import db from "./db"
import * as schema from "db/src/drizzle/schema"
import { cookies } from "next/headers"
import getSupabaseServerClient from "@/core/supabase/server-client"
import requireSession from "./user/require-session"
import configuration from "@/configuration"

export const auth = async () => {
	const client = getSupabaseServerClient()
	const session = await requireSession(client)

	const userSession = session.user

	const cookiesList = cookies()

	const membershipId = cookiesList.get("membership_id")?.value

	const user = await db.user.getOneWithMemberShip({ id: userSession.id, membershipId: membershipId || "" })

	if (!user || !user.onboarded) {
		redirect(configuration.paths.onboarding)
	}

	if (!membershipId || user.memberships.length === 0) {
		redirect(configuration.paths.switch)
	}

	const organization: schema.Organization | null | undefined = undefined

	// This should never happen
	if (!organization) {
		throw new Error("It should never get here")
	}

	return {
		organization: user.memberships[0].organization,
		workspaceId: user.memberships[0].organization.publicId,
		userId: userSession.id,
		user,
	}
}
