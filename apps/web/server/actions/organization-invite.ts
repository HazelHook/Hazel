"use server"

import { z } from "zod"
import { createAction, protectedProcedure } from "../trpc"
import db from "@/lib/db"
import { orgInviteFormSchema } from "@/lib/schemas/organization"

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

			// TODO: SEND EMAIL HERE

			return {
				id: invitation.publicId,
			}
		}),
)
