import { z } from "zod"

export const createDestinationSchema = z.object({
	name: z
		.string()
		.min(2, {
			message: "Name must be between atleast 2 characters long",
		})
		.max(20),
	key: z
		.string()
		.regex(/^[a-z_-]+$/, {
			message: "Only lowercase letters a-z, underscores, and hyphens are allowed",
		})
		.describe("Unique Identifier (to be used in our sdk)"),
	url: z.string().url(),
})

export const updateDestinationSchema = z.object({
	name: z
		.string()
		.min(2, {
			message: "Name must be between atleast 2 characters long",
		})
		.max(20),
	url: z.string().url(),
})
