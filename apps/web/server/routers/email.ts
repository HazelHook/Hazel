import { z } from "zod"
import { protectedProcedure, router } from "../trpc"

import { OrganizationInviteEmail } from "@hazel/email/emails/Invite"

import { Resend } from "resend"
import { clerkClient } from "@clerk/nextjs"
import { getSeededProfileImageUrl } from "@/lib/utils"
import db from "@/lib/db"
import { TRPCError } from "@trpc/server"
import { render } from "@react-email/render"

const resend = new Resend(process.env.RESEND_API_KEY)

export const emailRouter = router({
	invite: protectedProcedure
		.input(
			z.object({
				email: z.string(),
				inviteId: z.string(),
				organizationId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const organization = await db.organization.getOne({ publicId: input.organizationId })

			if (!organization) {
				throw new TRPCError({ message: "Organization doesn't exist", code: "NOT_FOUND" })
			}

			const sendingUser = await clerkClient.users.getUser(ctx.auth.customerId)
			const users = await clerkClient.users.getUserList({
				emailAddress: [input.email],
			})

			const user = users[0]

			const data = await resend.emails.send({
				from: "system@hazelapp.dev",
				to: input.email,
				subject: `${ctx.auth.customerId} invited you to join ${organization.name} on Hazel `,
				html: render(
					OrganizationInviteEmail({
						username: user?.username || input.email,
						userImage: user.profileImageUrl || getSeededProfileImageUrl(input.email),
						invitedByUsername: sendingUser.username || "Hazel User",
						invitedByEmail:
							sendingUser.emailAddresses.find((adress) => adress.id === sendingUser.primaryEmailAddressId)
								?.emailAddress || "",
						teamName: organization.name,
						teamImage: getSeededProfileImageUrl(organization.publicId),
						inviteLink: `https://app.hazelhook.dev/teams/invite/${input.inviteId}`,
					}),
				),
			})
			return data
		}),
})
