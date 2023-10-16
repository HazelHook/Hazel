"use server"

import { z } from "zod"
import { createAction, protectedProcedure } from "../trpc"
import db from "@/lib/db"
import { userUpdateFormSchema } from "@/lib/schemas/user"



export const updateUserAction = createAction(
	protectedProcedure.input(z.object({ id: z.string() }).merge(userUpdateFormSchema)).mutation(async (opts) => {
		const organization = await db.user.update({
			...opts.input,
		})

		return {
			id: opts.input.id,
		}
	}),
)



