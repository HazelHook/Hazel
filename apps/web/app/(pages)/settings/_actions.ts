"use server"

import { z } from "zod"

import { createAction, protectedProcedure } from "@/server/trpc"
import db from "@/lib/db"
import { orgInviteFormSchema } from "@/components/modals/schemas/organization"

export const createApiKeyAction = createAction(
	protectedProcedure.input(z.object({ workspaceId: z.string() })).mutation(async (opts) => {
		const connection = await db.api.create({
			workspaceId: opts.input.workspaceId,
		})

		return {
			id: connection.publicId,
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
