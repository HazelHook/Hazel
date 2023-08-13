import "server-only"

import { redirect } from "next/navigation"
import { auth as clerkAuth, currentUser } from "@clerk/nextjs"
import { retry } from "radash"

import db from "./db"
import * as schema from "db/src/drizzle/schema"
import { cookies } from "next/headers"

export const auth = async () => {
	const { userId } = clerkAuth()

	if (!userId) {
		redirect("/log-in")
	}
	const cookiesList = cookies()

	const membershipIdCookie = cookiesList.get("membership_id")

	let organization: schema.Organization | null | undefined = undefined

	if (membershipIdCookie?.value) {
		const membership = await db.organization.memberships.getOne({ membershipId: membershipIdCookie.value })
		organization = membership?.organization!
	}

	if (!organization) {
		organization = await db.organization.getPersonal({ customerId: userId })
	}

	if (!organization) {
		const user = await currentUser()
		await retry({}, async () => {
			await db.organization.create({
				ownerId: userId,
				personal: true,
				name: `${user!.username}'s Organization`,
			})
		})

		organization = await db.organization.getPersonal({ customerId: userId })
	}

	// This should never happen
	if (!organization) {
		redirect("/someroutetoshowerrormessagetocontactus")
	}

	return { organization, workspaceId: organization.publicId, userId }
}
