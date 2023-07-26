import "server-only"

import { redirect } from "next/navigation"
import { auth as clerkAuth, currentUser } from "@clerk/nextjs"
import { retry } from "radash"
import { randColor } from "@ngneat/falso"

import db from "./db"
import { generatePublicId } from "db/src/drizzle/schema/common"
import * as schema from "db/src/drizzle/schema"
import { cookies } from "next/headers"

export const auth = async () => {
	const { userId } = clerkAuth()

	if (!userId) {
		redirect("/log-in")
	}
	const cookiesList = cookies()

	const membership_id = cookiesList.get("membership_id")

	console.log(membership_id)

	let organization = await db.organization.getPersonal({ customerId: userId })

	if (!organization) {
		const user = await currentUser()
		await retry({}, async () => {
			await db.db.transaction(async (tx) => {
				const orgPublicId = generatePublicId("org")
				const res = await tx.insert(schema.organizations).values({
					name: `${user!.username}'s Organization`,
					ownerId: userId,
					slug: `${user!.username}_${randColor().toLowerCase()}`,
					publicId: orgPublicId,
				})

				const orgMembershipPublicId = generatePublicId("mem")

				await tx.insert(schema.organizationMembers).values({
					publicId: orgMembershipPublicId,
					customerId: userId,
					organizationId: Number(res.insertId),
					personal: true,
					role: "admin",
				})
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
