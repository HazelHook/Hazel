import db from "@/lib/db"
import { getSeededProfileImageUrl } from "@/lib/utils"
import { auth, clerkClient } from "@clerk/nextjs"
import OrganizationInviteEmail from "@hazel/email/emails/Invite"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const POST = async (request: Request) => {
	const { userId } = auth()

	if (!userId) {
		return new Response("Unauthorized", { status: 401 })
	}

	const body = await request.json()
	const organization = await db.organization.getOne({ publicId: body.organizationId })

	if (!organization) {
		return new Response("No Organzation for this id bruv kek", { status: 404 })
	}

	const sendingUser = await clerkClient.users.getUser(userId)
	const users = await clerkClient.users.getUserList({
		emailAddress: body.email,
	})

	console.log(users)

	const user = users[0]

	const data = await resend.emails.send({
		from: "system@hazelapp.dev",
		to: body.email,
		subject: `${userId} invited you to join ${organization.name} on Hazel `,
		react: OrganizationInviteEmail({
			username: user?.username || body.email,
			userImage: user.profileImageUrl || getSeededProfileImageUrl(body.email),
			invitedByUsername: sendingUser.username || "Hazel User",
			invitedByEmail:
				sendingUser.emailAddresses.find((adress) => adress.id === sendingUser.primaryEmailAddressId)?.emailAddress ||
				"",
			teamName: organization.name,
			teamImage: getSeededProfileImageUrl(organization.publicId),
			inviteLink: `https://app.hazelhook.dev/teams/invite/${body.inviteId}`,
		}),
	})
	return data
}
