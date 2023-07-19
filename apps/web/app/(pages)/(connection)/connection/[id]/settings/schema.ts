import { z } from "zod"

export const formSchema = z.object({
	name: z
		.string()
		.min(2, {
			message: "Name must be between 2 and 20 characters long",
		})
		.max(20),
	delay: z.number().min(0).optional(),
	publicId: z.string(),
	publicSourceId: z.string().length(21, { message: "You need to Select/Create a Source" }),
	publiceDestinationId: z.string().length(21, { message: "You need to Select/Create a Destination" }),
})
