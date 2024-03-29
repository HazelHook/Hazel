import { z } from "zod"

export const createSourceSchema = z.object({
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
	key: z.string().regex(/^[a-z_-]+$/, {
		message: "Only lowercase letters a-z, underscores, and hyphens are allowed",
	}),
	integrationId: z.string().nullable().optional(),
})
