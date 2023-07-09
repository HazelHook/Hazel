import { z } from "zod"

import { TinybirdView, body, hazelVersion, headers, period, successState, timestamp } from "../zod-common"
import { Tinybird } from "@chronark/zod-bird"

const ids: Record<string, z.ZodTypeAny> = {
	id: z.string(),
	customer_id: z.string(),
	source_id: z.string(),
	request_id: z.string(),
}

export const requestEventSchema = z.object({
	// IDs
	...ids,

	// Metadata
	version: hazelVersion,

	// Timestamps
	timestamp,

	// Status
	validated: successState,
	rejected: successState,

	// Data
	body,
	headers,
})
export type RequestEvent = z.infer<typeof requestEventSchema>

export const buildTinyBirdRequest = (tb: Tinybird) => {
	return new TinybirdView({
		name: "requests",
		schema: requestEventSchema,
		tb,
		requestParameters: z.object({
			...ids,
		
			limit: z.number().optional(),
			offset: z.number().optional(),
		}),
		kpisSchema: z.object({
			customer_id: z.string(),
			source_id: z.string().optional(),
		
			success: z.number().optional(),
		
			period: period.default("daily").optional(),
			start_date: z.date(),
			end_date: z.date().optional(),
		}),
		timeseriesSchema: z
		.object({
			customer_id: z.string(),
			source_id: z.string().optional(),
		
			period: period.default("daily").optional(),
			start_date: z.date(),
			end_date: z.date().optional(),
		}),
	})
}
