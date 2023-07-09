import { z } from "zod"

import { TinybirdView, body, hazelVersion, headers, period, successState, timestamp } from "../zod-common"
import { Tinybird } from "@chronark/zod-bird"

const ids: Record<string, z.ZodTypeAny> = {
	id: z.string(),
	customer_id: z.string(),
	source_id: z.string(),
	destination_id: z.string(),
	request_id: z.string(),
}

export const responseEventSchema = z.object({
	// IDs
	...ids,

	// Metadata
	version: hazelVersion,

	// Timestamps
	response_time: timestamp,
	timestamp: timestamp,

	// Status
	status: z.number(),
	success: z.number(),

	// Data
	body,
	headers,
})
export type ResponseEvent = z.infer<typeof responseEventSchema>

export const buildTinyBirdResponse = (tb: Tinybird) => {
	return new TinybirdView({
		name: "responses",
		schema: responseEventSchema,
		tb,
		requestParameters: z.object({
			...ids,
		
			limit: z.number().optional(),
			offset: z.number().optional(),
		}),
		kpisSchema: z.object({
			customer_id: z.string(),
			
			date: z.string(),

			requests: z.number(),
			sources: z.number(),
		}),
		timeseriesSchema: z
		.object({
			customer_id: z.string(),
			source_id: z.string(),
			destination_id: z.string(),
	
			date: z.date(),
	
			events: z.number(),
			status: successState,
		}),
	})
}
