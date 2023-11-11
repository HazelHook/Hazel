import * as z from "zod"

export const searchParamsSchema = z.object({
	page: z.string().default("1"),
	per_page: z.string().default("10"),
	sort: z.string().optional(),
	// operator: z.string().optional(),
})

export const errorPageSearchParamsSchema = z.object({
	dest: z.string().optional(),
})

export const responseTableSearchParamsSchema = z.object({
	response_id: z.string().optional(),
	status: z
		.string()
		.transform((value) => value.split(".").map(Number))
		.optional(),
})
