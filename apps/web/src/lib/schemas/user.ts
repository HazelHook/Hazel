import { z } from "zod"

export const userUpdateFormSchema = z.object({
	name: z.string().min(3).max(20),
})

export const userUpdateEmailFormSchema = z
	.object({
		email: z.string().email().describe("New Email"),
		confirmEmail: z.string().email(),
	})
	.superRefine(({ email, confirmEmail }, ctx) => {
		if (email !== confirmEmail) {
			ctx.addIssue({
				code: "custom",
				message: "The email did not match",
			})
		}
	})
