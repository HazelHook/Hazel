import { z } from "zod"

export const createApiKeySchema = z.object({
	name: z
		.string()
		.min(2, {
			message: "Name must be between 2 and 20 characters long",
		})
		.max(20),
})
