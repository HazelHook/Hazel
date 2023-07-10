import { z } from "zod"

import { TinybirdResourceBuilder, ZodMapped, body, hazelVersion, headers, period, successState, timestamp } from "../zod-common"
import { Tinybird } from "@chronark/zod-bird"

const schema = {
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
}
export type TBRequest = ZodMapped<typeof schema>
const parameters = {
	customer_id: z.string(),
	source_id: z.string().optional(),
	request_id: z.string().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
}
export type TBRequestParameters = ZodMapped<typeof parameters>

const kpiSchema = {
	date: z.string(),
	customer_id: z.string(),
	events: z.number(),
	sources: z.number(),
}
export type TBKpiRequest = ZodMapped<typeof kpiSchema>
const kpiParameters = {
	customer_id: z.string(),
	start_date: z.string(),
	end_date: z.string().optional(),
	period: period.default("daily").optional(),
	source_id: z.string().optional(),
}
export type TBKpiRequestParameters = ZodMapped<typeof kpiParameters>

const timelineSchema = {
	date: z.string(),
				customer_id: z.string(),
				source_id: z.string(),
				events: z.number(),
}
export type TBTimelineRequest = ZodMapped<typeof timelineSchema>
const timelineParameters = {
	customer_id: z.string(),
	source_id: z.string().optional(),
	start_date: z.string(),
	end_date: z.string().optional(),
	period: period.default("daily").optional(),
}
export type TBTimelineRequestParameters = ZodMapped<typeof timelineParameters>


export const buildTinyBirdRequest = (tb: Tinybird) => {
	return TinybirdResourceBuilder.build({
		tb,
		name: "get_request",
		schema: schema,
		parameters: parameters,
	})
		.add({
			name: "kpi_request",
			schema: kpiSchema,
			parameters: kpiParameters,
		})
		.add({
			name: "timeline_request",
			schema: timelineSchema,
			parameters: timelineParameters
		})
		.finalize()
}