"use server"

import { z } from "zod"

import { createAction, protectedProcedure } from "@hazel/server/actions/trpc"

import db from "@/lib/db"
import { createDestinationSchema, updateDestinationSchema } from "@/lib/schemas/destination"

export const createDestinationAction = createAction(
	protectedProcedure.input(createDestinationSchema).mutation(async (opts) => {
		const source = await db.destination.create({
			...opts.input,
			workspaceId: opts.ctx.auth.workspaceId,
		})

		return {
			id: source.publicId,
		}
	}),
)

export const updateDestinationAction = createAction(
	protectedProcedure
		.input(z.object({ publicId: z.string() }).merge(updateDestinationSchema))
		.mutation(async (opts) => {
			const destination = await db.destination.update({
				...opts.input,
				workspaceId: opts.ctx.auth.workspaceId,
			})

			return {
				id: destination.publicId,
			}
		}),
)

export const deleteDestinationAction = createAction(
	protectedProcedure.input(z.string()).mutation(async (opts) => {
		await db.destination.markAsDeleted({
			publicId: opts.input,
		})
	}),
)
