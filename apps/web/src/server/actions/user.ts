"use server"

import { z } from "zod"

import db from "@/lib/db"
import { userUpdateFormSchema } from "@/lib/schemas/user"

import { TRPCError, createAction, protectedProcedure } from "@hazel/server/actions/trpc"
import { getSupabaseServerActionClient } from "@hazel/supabase/clients"

export const updateUserAction = createAction(
	protectedProcedure.input(z.object({ id: z.string() }).merge(userUpdateFormSchema)).mutation(async ({ input }) => {
		const organization = await db.user.update({
			...input,
		})

		console.log(input)

		return {
			id: input.id,
		}
	}),
)

export const updateUserProfileImageAction = createAction(
	protectedProcedure
		.input(z.object({ imageBuffer: z.string(), fileExt: z.enum(["jpg", "jpeg", "png", "gif"]) }))
		.mutation(async ({ input, ctx }) => {
			const client = getSupabaseServerActionClient({ admin: true })
			const buffer = Buffer.from(input.imageBuffer, "base64")

			const bucket = client.storage.from("avatars")
			const extension = input.fileExt
			const fileName = `${ctx.auth.customerId}.${extension}`

			const result = await bucket.upload(fileName, buffer, {
				upsert: true,
			})

			if (result.error) {
				throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: result.error.message })
			}

			await db.user.update({
				id: ctx.auth.customerId,
				profileImage: bucket.getPublicUrl(fileName).data.publicUrl,
			})

			return {
				id: input,
			}
		}),
)
