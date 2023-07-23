import "server-only"

import { redirect } from "next/navigation"
import { auth as clerkAuth, currentUser } from "@clerk/nextjs"
import { retry } from "radash"
import { randColor } from "@ngneat/falso"

import db from "./db"

export const auth = async () => {
	const { userId } = clerkAuth()

	if (!userId) {
		redirect("/log-in")
	}

	let organization = await db.organization.getPersonal({ customerId: userId })

	if (!organization) {
		const user = await currentUser()
		await retry({}, () =>
			db.organization.create({
				name: `${user!.username}'s Organization`,
				ownerId: userId,
				slug: `${user!.username}_${randColor().toLowerCase()}`,
				personal: true,
			}),
		)

		organization = await db.organization.getPersonal({ customerId: userId })
	}

	// This should never happen
	if (!organization) {
		redirect("/someroutetoshowerrormessagetocontactus")
	}

	return { organization, workspaceId: organization.publicId }
}
