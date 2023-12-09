"use server"

import { createConnectionSchema, updateConnectionSchema } from "@/lib/schemas/connection"

import { db } from "@hazel/db"
import { createAction, protectedProcedure } from "@hazel/server/actions/trpc"
import { z } from "zod"

export const createConnectionAction = createAction(
	protectedProcedure.input(createConnectionSchema).mutation(async (opts) => {
		const source = await db.db.query.source.findFirst({
			where: (source, { eq }) => eq(source.publicId, opts.input.publicSourceId),
		})

		const destination = await db.db.query.destination.findFirst({
			where: (source, { eq }) => eq(source.publicId, opts.input.publiceDestinationId),
		})

		if (!destination || !source) {
			throw new Error("Doesnt exist bruw")
		}

		const connection = await db.connection.create({
			name: opts.input.name,
			sourceId: source.id,
			destinationId: destination.id,
			workspaceId: opts.ctx.auth.workspaceId,
		})

		return {
			id: connection.publicId,
		}
	}),
)

export const pauseConnectionAction = createAction(
	protectedProcedure.input(z.object({ publicId: z.string(), enabled: z.boolean() })).mutation(async (opts) => {
		const connection = await db.connection.update({
			enabled: opts.input.enabled,
			publicId: opts.input.publicId,
		})

		return {
			id: connection.publicId,
		}
	}),
)

export const updateConnectionAction = createAction(
	protectedProcedure
		.input(z.object({ publicId: z.string() }).merge(updateConnectionSchema))
		.mutation(async ({ input, ctx }) => {
			// const source = await db.db.query.source.findFirst({
			// 	where: (source, { eq }) => eq(source.publicId, opts.input.publicSourceId),
			// })

			// const destination = await db.db.query.destination.findFirst({
			// 	where: (source, { eq }) => eq(source.publicId, opts.input.publiceDestinationId),
			// })

			// if (!destination || !source) {
			// 	throw new Error("Doesnt exist bruw")
			// }
			const { retryCount, ...rest } = input

			const connection = await db.connection.update({
				workspaceId: ctx.auth.workspaceId,
				...rest,
				retyCount: retryCount,
			})

			return {
				id: connection.publicId,
			}
		}),
)

export const deleteConnectionAction = createAction(
	protectedProcedure.input(z.string()).mutation(async (opts) => {
		await db.connection.delete({
			publicId: opts.input,
		})
	}),
)
