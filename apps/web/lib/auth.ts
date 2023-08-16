import "server-only"

import { redirect } from "next/navigation"
import { retry } from "radash"

import db from "./db"
import * as schema from "db/src/drizzle/schema"
import { cookies } from "next/headers"
import getSupabaseServerClient from "@/core/supabase/server-client"
import requireSession from "./user/require-session"

export const auth = async () => {
	const client = getSupabaseServerClient()
	const session = await requireSession(client)

	const user = session.user

	const cookiesList = cookies()

	const membershipIdCookie = cookiesList.get("membership_id")?.value

	let organization: schema.Organization | null | undefined = undefined

	if (membershipIdCookie) {
		const membership = await db.organization.memberships.getOne({ membershipId: membershipIdCookie })
		organization = membership?.organization!
	}

	if (!organization) {
		organization = await db.organization.getPersonal({ customerId: user.id })
	}

	if (!organization) {
		await retry({}, async () => {
			await db.organization.create({
				ownerId: user.id,
				personal: true,
				name: `${user.app_metadata.name}'s Organization`,
			})
		})

		organization = await db.organization.getPersonal({ customerId: user.id })
	}

	// This should never happen
	if (!organization) {
		redirect("/someroutetoshowerrormessagetocontactus")
	}

	return { organization, workspaceId: organization.publicId, userId: user.id, user }
}
