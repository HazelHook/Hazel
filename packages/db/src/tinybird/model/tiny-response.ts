import { Tinybird } from "@chronark/zod-bird"
import { z } from "zod"

import { body, hazelVersion, headers, period, TinybirdResourceBuilder, ZodMapped } from "../zod-common"

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
	send_timestamp: z.string(),
	timestamp: z.string(),

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

const kpiSchema = {
	date: z.string(),
	customer_id: z.string(),
	requests: z.number(),
	sources: z.number(),
}
export type TBKpiResponse = ZodMapped<typeof kpiSchema>
const kpiParameters = {
	customer_id: z.string(),
	start_date: z.string(),
	end_date: z.string().optional(),
	period: period.default("daily").optional(),
	source_id: z.string().optional(),
}
export type TBKpiResponseParameters = ZodMapped<typeof kpiParameters>

const timelineSchema = {
	date: z.string(),
	source_id: z.string(),
	customer_id: z.string(),
	status: z.number(),
	events: z.number(),
}
export type TBTimelineResponse = ZodMapped<typeof timelineSchema>
const timelineParameters = {
	customer_id: z.string(),
	start_date: z.string(),
	end_date: z.string().optional(),
	period: period.default("daily").optional(),
	source_id: z.string().optional(),
}
export type TBTimelineResponseParameters = ZodMapped<typeof timelineParameters>

export const buildTinyBirdResponse = (tb: Tinybird) => {
	const builder = new TinybirdResourceBuilder({
		tb,
		name: "response",
	})

	const get = builder.build({
		name: "get",
		schema,
		parameters,
		datasource: "response_events",
	})

	return {
		get: get.get,
		publish: get.publish!,
		kpi: builder.build({
			name: "kpi",
			schema: kpiSchema,
			parameters: kpiParameters,
		}).get,
		timeline: builder.build({
			name: "timeline",
			schema: timelineSchema,
			parameters: timelineParameters,
		}).get,
	}
}
