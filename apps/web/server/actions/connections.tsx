"use server"

import { z } from "zod"

import { createAction, protectedProcedure } from "@/server/trpc"
import db from "@/lib/db"

import { formSchema } from "../../app/(pages)/(connection)/connection/new/schema"

/**
 * Either inline procedures using trpc's flexible
 * builder api, with input parsers and middleware
 * Wrap the procedure in a `createAction` call to
 * make it server-action friendly
 */
export const createConnectionAction = createAction(
	protectedProcedure.input(formSchema).mutation(async (opts) => {
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
	protectedProcedure.input(z.object({ publicId: z.string() }).merge(formSchema)).mutation(async (opts) => {
		const source = await db.db.query.source.findFirst({
			where: (source, { eq }) => eq(source.publicId, opts.input.publicSourceId),
		})

		const destination = await db.db.query.destination.findFirst({
			where: (source, { eq }) => eq(source.publicId, opts.input.publiceDestinationId),
		})

		if (!destination || !source) {
			throw new Error("Doesnt exist bruw")
		}

		const connection = await db.connection.update({
			name: opts.input.name,
			sourceId: source.id,
			destinationId: destination.id,
			workspaceId: opts.ctx.auth.workspaceId,
			publicId: opts.input.publicId,
		})

		return {
			id: connection.publicId,
		}
	}),
)

export const deleteConnectionAction = createAction(
	protectedProcedure.input(z.string()).mutation(async (opts) => {
		await db.connection.markAsDeleted({
			publicId: opts.input,
		})
	}),
)
