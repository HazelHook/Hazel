import { z } from "zod"

export const formSchema = z.object({
	publicId: z.string(),
	name: z
		.string()
		.min(2, {
			message: "Name must be between atleast 2 characters long",
		})
		.max(20),
	url: z.union([z.literal(""), z.string().trim().url()]).optional(),
	integrationId: z.string().nullable(),
})
