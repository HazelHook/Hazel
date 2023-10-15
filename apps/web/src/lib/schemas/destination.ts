import { z } from "zod"

export const createDestinationSchema = z.object({
	name: z
		.string()
		.min(2, {
			message: "Name must be between atleast 2 characters long",
		})
		.max(20),
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
