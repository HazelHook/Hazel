import { z } from "zod"

export const memberRoles = z.enum(["member", "admin", "owner"])

export const orgInviteFormSchema = z.object({
	email: z.string().email(),
	role: memberRoles,
})

export const orgUpdateFormSchema = z.object({
	name: z.string().min(3).max(20),
	slug: z.string().min(3).max(20),
})
