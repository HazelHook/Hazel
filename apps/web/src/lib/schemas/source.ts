import { z } from "zod"

export const createSourceSchema = z.object({
	name: z
		.string()
		.min(2, {
			message: "Name must be between atleast 2 characters long",
		})
		.max(20),
	url: z
		.union([z.literal(""), z.string().trim().url()])
		.optional()
		.describe("Source URL"),
	integrationId: z.string().optional().describe("Integration"),
})

export const updateSourceSchema = z.object({
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
