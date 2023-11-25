"use server"

import tiny from "@/lib/tiny"
import { TRPCError, createAction, protectedProcedure } from "@hazel/server/actions/trpc"
import { z } from "zod"

export const retryRequestAction = createAction(
	protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
		console.log(input.id)

		const res = await tiny.request.get({ workspace_id: ctx.auth.workspaceId, request_id: input.id })

		const request = res.data[0]

		if (!request) {
			throw new TRPCError({ message: "Request with this ID doesn't exist", code: "NOT_FOUND" })
		}

		// console.log(request.headers)

		const headers = JSON.parse(request.headers)

		console.log(headers)

		const retryRes = await fetch(`http://localhost:3003/v1/hook/${request.id}`, {
			headers: headers,
			body: request.body,
			method: "POST",
		})

        console.log(retryRes.ok)

        if(!retryRes.ok) {
       const body = await retryRes.json()

            throw new TRPCError({message: body.message, code: "NOT_FOUND"})
        }



		return {
			id: input.id,
		}
	}),
)
