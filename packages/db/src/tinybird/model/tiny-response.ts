import { z } from "zod"

import { TinybirdResourceBuilder, ZodMapped, body, hazelVersion, headers, period, successState, timestamp } from "../zod-common"
import { Tinybird } from "@chronark/zod-bird"

const schema = {
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
}
export type TBResponse = ZodMapped<typeof schema>
const parameters = {
	customer_id: z.string(),
	destination_id: z.string().optional(),
	request_id: z.string().optional(),
	source_id: z.string().optional(),
	response_id: z.string().optional(),
}
export type TBResponseParameters = ZodMapped<typeof parameters>

const responseKpi = {
	date: z.string(),
	customer_id: z.string(),
	requests: z.number(),
	sources: z.number(),
}
export type TBKpiResponse = ZodMapped<typeof responseKpi>
const responseKpiParameters = {
	customer_id: z.string(),
	start_date: z.string(),
	end_date: z.string().optional(),
	period: period.default("daily").optional(),
	source_id: z.string().optional(),
}
export type TBKpiResponseParameters = ZodMapped<typeof responseKpiParameters>

const responseTimeline = {
	date: z.string(),
	source_id: z.string(),
	customer_id: z.string(),
	status: z.number(),
	events: z.number(),
}
export type TBTimelineResponse = ZodMapped<typeof responseTimeline>
const responseTimelineParameters = {
	customer_id: z.string(),
	start_date: z.string(),
	end_date: z.string().optional(),
	period: period.default("daily").optional(),
	source_id: z.string().optional(),
}
export type TBTimelineResponseParameters = ZodMapped<typeof responseTimelineParameters>

export const buildTinyBirdResponse = (tb: Tinybird) => {
	return TinybirdResourceBuilder.build({
		tb,
		name: "get_response",
		schema,
		parameters
	})
		.add({
			name: "kpi_response",
			schema: responseKpi,
			parameters: responseKpiParameters,
		})
		.add({
			name: "timeline_response",
			schema: responseTimeline,
			parameters: responseTimelineParameters,
		})
		.finalize()
}
