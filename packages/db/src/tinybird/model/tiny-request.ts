import { z } from "zod"

import { TinybirdResourceBuilder, body, hazelVersion, headers, period, successState, timestamp } from "../zod-common"
import { Tinybird } from "@chronark/zod-bird"

export const buildTinyBirdRequest = (tb: Tinybird) => {
	return TinybirdResourceBuilder.build({
		tb,
		name: "get_request",
		schema: {
			// IDs
			id: z.string(),
			customer_id: z.string(),
			source_id: z.string(),
		
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
		},
		parameters: {
			customer_id: z.string(),
			source_id: z.string().optional(),
			request_id: z.string().optional(),
			limit: z.number().optional(),
			offset: z.number().optional(),
		}
	}).add({
		name: "kpi_request",
		schema: {
			date: z.string(),
			customer_id: z.string(),
			events: z.number(),
			sources: z.number(),
		},
		parameters: {
			customer_id: z.string(),
			start_date: z.string(),
			end_date: z.string().optional(),
			period: period.default("daily").optional(),
			source_id: z.string().optional(),
		},
	}).add({
		name: "timeline_request",
		schema: {
			date: z.string(),
			customer_id: z.string(),
			source_id: z.string(),
			events: z.number(),
		},
		parameters: {
			customer_id: z.string(),
			source_id: z.string().optional(),
			start_date: z.string(),
			end_date: z.string().optional(),
			period: period.default("daily").optional(),
		},
	}).finalize()
}
