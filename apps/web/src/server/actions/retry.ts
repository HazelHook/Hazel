"use server"

import { createAction, protectedProcedure, TRPCError } from "@hazel/server/actions/trpc"
import tiny from "@hazel/tinybird"
import { z } from "zod"

export const retryRequestAction = createAction(
	protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
		const res = await tiny.request.get({
			workspace_id: ctx.auth.workspaceId,
			request_id: input.id,
		})

		const request = res.data[0]

		if (!request) {
			throw new TRPCError({
				message: "Request with this ID doesn't exist",
				code: "NOT_FOUND",
			})
		}

		const headers = JSON.parse(request.headers)

		const retryRes = await fetch(`${process.env.BACKEND_URL}/v1/hook/${request.source_id}`, {
			headers: headers,
			body: request.body,
			method: "POST",
		})

		if (!retryRes.ok) {
			const body = await retryRes.json()

			throw new TRPCError({ message: body.message, code: "NOT_FOUND" })
		}

		return {
			id: input.id,
		}
	}),
)
