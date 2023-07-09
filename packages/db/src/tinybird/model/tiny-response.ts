import { z } from "zod"

import { TinybirdView, body, hazelVersion, headers, period, successState, timestamp } from "../zod-common"
import { Tinybird } from "@chronark/zod-bird"

export const responseEventSchema = z.object({
	// IDs
	id: z.string(),
	customer_id: z.string(),
	source_id: z.string(),
	destination_id: z.string(),
	request_id: z.string(),

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
			id: z.string().optional(),
			customer_id: z.string().optional(),
			source_id: z.string().optional(),
			destination_id: z.string().optional(),
			request_id: z.string().optional(),

			success: z.number().optional(),
			start_date: z.date().optional(),
			end_date: z.date().optional(),
			
		
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
