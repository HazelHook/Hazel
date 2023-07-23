"use server"

import { z } from "zod"

import { createAction, protectedProcedure } from "@/server/trpc"
import db from "@/lib/db"

import { formSchema } from "./destination/new/schema"

export const createDestinationAction = createAction(
	protectedProcedure.input(formSchema).mutation(async (opts) => {
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
	protectedProcedure.input(z.object({ publicId: z.string() }).merge(formSchema)).mutation(async (opts) => {
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
