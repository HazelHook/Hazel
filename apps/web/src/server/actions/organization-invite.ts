"use server"

import { orgInviteFormSchema } from "@/lib/schemas/organization"

import { db } from "@hazel/db"
import { basicProtectedProcedure, createAction, protectedProcedure, TRPCError } from "@hazel/server/actions/trpc"
import { z } from "zod"

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

export const acceptOrganizationInvite = createAction(
	basicProtectedProcedure
		.input(
			z.object({
				inviteId: z.string(),
			}),
		)
		.mutation(async (opts) => {
			const invitation = await db.organization.invite.get({
				publicId: opts.input.inviteId,
			})

			if (!invitation) {
				throw new TRPCError({
					message: "Invitiation with code doesn't exist",
					code: "NOT_FOUND",
				})
			}

			if (opts.ctx.auth.user.email !== invitation.email) {
				throw new TRPCError({
					message: "Email doesn't match the invite link",
					code: "FORBIDDEN",
				})
			}

			await db.organization.memberships.create({
				userId: opts.ctx.auth.user.id,
				organizationId: invitation.organizationId,
				role: invitation.role,
			})

			return {
				organizationId: opts.ctx.auth.workspaceId,
			}
		}),
)
