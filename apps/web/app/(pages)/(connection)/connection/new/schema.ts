import { z } from "zod"

export const formSchema = z.object({
	name: z
		.string()
		.min(2, {
			message: "Name must be between atleast 2 characters long",
		})
		.max(20),
	publicSourceId: z.string().length(21, { message: "You need to Select/Create a Source" }),
	publiceDestinationId: z.string().length(21, { message: "You need to Select/Create a Destination" }),
})
