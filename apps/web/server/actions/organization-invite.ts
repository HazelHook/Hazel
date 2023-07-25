"use server"

import { z } from "zod"
import { createAction, protectedProcedure } from "../trpc"
import db from "@/lib/db"
import { orgInviteFormSchema } from "@/lib/schemas/organization"

// import { Resend } from "resend"
// import { OrganizationInviteEmail } from "@/lib/emails/organization/Invite"

// const resend = new Resend(process.env.RESEND_API_KEY)

export const revokeOrganizationInvite = createAction(
	protectedProcedure
		.input(
			z.object({
				inviteId: z.string(),
			}),
		)
		.mutation(async (opts) => {
			const invitation = await db.organization.invite.revoke({
				publicInviteId: opts.input.inviteId,
			})

			// TODO: SEND EMAIL HERE

			return {
				id: invitation.publicId,
			}
		}),
)

export const createOrganizationInvite = createAction(
	protectedProcedure
		.input(
			orgInviteFormSchema.merge(
				z.object({
					organizationId: z.number(),
				}),
			),
		)
		.mutation(async (opts) => {
			const invitation = await db.organization.invite.create({
				workspaceId: opts.ctx.auth.workspaceId,
				...opts.input,
			})

			// const data = await resend.emails.send({
			// 	from: "system@hazelapp.dev",
			// 	to: opts.input.email,
			// 	subject: `${opts.ctx.auth.customerId} invited you to join ORGNAMEHERE on Hazel `,
			// 	html: "<strong>it works!</strong>",
			// })

			return {
				// email: data,
				id: invitation.publicId,
			}
		}),
)
