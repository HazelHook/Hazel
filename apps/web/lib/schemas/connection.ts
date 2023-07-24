import { z } from "zod"

export const createConnectionSchema = z.object({
	name: z
		.string()
		.min(2, {
			message: "Name must be between 2 and 20 characters long",
		})
		.max(20),
	publicSourceId: z.string().length(21, { message: "You need to Select/Create a Source" }),
	publiceDestinationId: z.string().length(21, { message: "You need to Select/Create a Destination" }),
})

export const updateConnectionSchema = z.object({
	name: z
		.string()
		.min(2, {
			message: "Name must be between 2 and 20 characters long",
		})
		.max(20),
	delay: z.number().min(0).optional(),
	retryCount: z.number().min(0).max(10).optional(),
	retryDelay: z.number().min(0).optional(),
	retryType: z.enum(["fixed", "exponential"]).optional(),
	publicId: z.string(),
	publicSourceId: z.string().length(21, { message: "You need to Select/Create a Source" }),
	publiceDestinationId: z.string().length(21, { message: "You need to Select/Create a Destination" }),
})
