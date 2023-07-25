"use server"

import { z } from "zod"
import { createAction, protectedProcedure } from "../trpc"
import db from "@/lib/db"
import { orgInviteFormSchema } from "@/lib/schemas/organization"
import { serverClient } from "../server"

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

			// await serverClient.email.invite.mutate({
			// 	organizationId: opts.ctx.auth.workspaceId,
			// 	email: opts.input.email,
			// 	inviteId: invitation.publicId,
			// })

			return {
				// email: data,
				email: opts.input.email,
				organizationId: opts.ctx.auth.workspaceId,
				id: invitation.publicId,
			}
		}),
)
