import { z } from "zod"

import { searchParamsSchema } from "./validators/params"

export const getTableParams = <SchemaType extends z.ZodObject<any, any>>(
	searchParams: {
		[key: string]: string | string[] | undefined
	},
	extendedSchema?: SchemaType,
) => {
	const extendedSchemaWithDefault = extendedSchema || z.object({})

	const { page, per_page, sort, ...rest } = searchParamsSchema.merge(extendedSchemaWithDefault).parse(searchParams)

	// Fallback page for invalid page numbers
	const pageAsNumber = Number(page)
	const fallbackPage = Number.isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber
	// Number of items per page
	const perPageAsNumber = Number(per_page)
	const limit = Number.isNaN(perPageAsNumber) ? 10 : perPageAsNumber
	// Number of items to skip
	const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0

	return {
		offset,
		limit,
		sort,
		per_page,
		page,
		...(rest as z.infer<SchemaType>),
	}
}
