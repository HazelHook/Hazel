import { z } from "zod"

export const userUpdateFormSchema = z.object({
	name: z.string().min(3).max(20),
	// profile_image: z.string().url().optional(),
	// TODO: READD PROFILE IMAGE UPLOAD
})
