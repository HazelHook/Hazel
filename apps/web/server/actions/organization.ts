"use server"

import { z } from "zod"
import { createAction, protectedProcedure } from "../trpc"
import db from "@/lib/db"
import { orgUpdateFormSchema } from "@/lib/schemas/organization"

export const updateOrganzationAction = createAction(
	protectedProcedure.input(z.object({ publicId: z.string() }).merge(orgUpdateFormSchema)).mutation(async (opts) => {
		const organization = await db.organization.update({
			...opts.input,
		})

		return {
			id: opts.input.publicId,
		}
	}),
)
