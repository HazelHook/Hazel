import { z } from "zod"

import { TinybirdResourceBuilder, body, hazelVersion, headers, period, successState, timestamp } from "../zod-common"
import { Tinybird } from "@chronark/zod-bird"

export const buildTinyBirdResponse = (tb: Tinybird) => {
	return TinybirdResourceBuilder.build({
		tb,
		name: "get_response",
		schema: {
			// IDs
			id: z.string(),
			customer_id: z.string(),
			source_id: z.string(),
			destination_id: z.string(),
			request_id: z.string(),

			// Metadata
			version: hazelVersion,

			// Timestamps
			send_timestamp: timestamp,
			timestamp: timestamp,

			// Status
			status: z.number(),
			success: z.number(),

			// Data
			body,
			headers,
		},
		parameters: {
			customer_id: z.string(),
			destination_id: z.string().optional(),
			request_id: z.string().optional(),
			source_id: z.string().optional(),
			response_id: z.string().optional(),
		},
	})
		.add({
			name: "kpi_response",
			schema: {
				date: z.string(),
				customer_id: z.string(),
				requests: z.number(),
				sources: z.number(),
			},
			parameters: {
				customer_id: z.string(),
				start_date: z.string(),
				end_date: z.string().optional(),
				period: period.default("daily").optional(),
				source_id: z.string().optional(),
			},
		})
		.add({
			name: "timeline_response",
			schema: {
				id: z.string(),
				source_id: z.string(),
				customer_id: z.string(),
				status: z.number(),
				events: z.number(),
			},
			parameters: {
				customer_id: z.string(),
				start_date: z.string(),
				end_date: z.string().optional(),
				period: period.default("daily").optional(),
				source_id: z.string().optional(),
			},
		})
		.finalize()
}
