import { z } from "zod"

export const memberRoles = z.enum(["member", "admin", "owner"])

export const orgInviteFormSchema = z.object({
	email: z.string().email(),
	role: memberRoles,
})
