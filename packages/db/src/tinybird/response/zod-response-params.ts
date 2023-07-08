import { z } from "zod"

import { period } from "../zod-common"

export const getResponseParams = z.object({
	customer_id: z.string(),
	request_id: z.string().optional(),
	response_id: z.string().optional(),
	source_id: z.string().optional(),
	destination_id: z.string().optional(),

	limit: z.number().optional(),
	offset: z.number().optional(),
})

export const getResponseKpisParams = z.object({
	customer_id: z.string(),
	source_id: z.string().optional(),

	start_date: z.date(),
	end_date: z.date().optional(),
	period: period.default("daily").optional(),

	success: z.number().optional(),
})

export const getResponseTimeseriesParams = z.object({
	customer_id: z.string(),
	source_id: z.string().optional(),
	destination_id: z.string().optional(),

	start_date: z.date(),
	end_date: z.date().optional(),
	period: period.default("daily").optional(),
})
