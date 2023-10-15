import { auth } from "@//lib/auth"
import db from "@//lib/db"
import { getSeededProfileImageUrl } from "@//lib/utils"
import OrganizationInviteEmail from "@hazel/email/emails/Invite"
import { NextResponse } from "next/server"
import { Resend } from "resend"

export const POST = async (request: Request) => {
	const resend = new Resend(process.env.RESEND_API_KEY)

	const { userId, user } = await auth()

	if (!userId) {
		return new Response("Unauthorized", { status: 401 })
	}

	const body = await request.json()
	const organization = await db.organization.getOne({ publicId: body.organizationId })

	if (!organization) {
		return new Response("No Organzation for this id bruv kek", { status: 404 })
	}

	const data = await resend.emails.send({
		from: "Hazel <system@hazelapp.dev>",
		to: body.email,
		subject: `TODO invited you to join ${organization.name} on Hazel `,
		react: OrganizationInviteEmail({
			username: "TODO" || body.email,
			userImage: "TODO" || getSeededProfileImageUrl(body.email),
			invitedByUsername: user.name || "",
			invitedByEmail: user.email!,
			teamName: organization.name,
			teamImage: "https://cdn5.vectorstock.com/i/1000x1000/41/09/round-u-logo-vector-14184109.jpg",
			inviteLink: `https://app.hazelhook.dev/teams/invite/${body.inviteId}`,
		}),
	})

	return NextResponse.json(data)
}
