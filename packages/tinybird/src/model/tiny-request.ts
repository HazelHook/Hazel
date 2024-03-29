import { Tinybird } from "@chronark/zod-bird"
import { z } from "zod"

import { body, hazelVersion, headers, period, TinybirdResourceBuilder, ZodMapped } from "../zod-common"

const schema = {
	// IDs
	id: z.string(),
	workspace_id: z.string(),
	source_id: z.string(),

	// Metadata
	version: hazelVersion,

	// Timestamps
	timestamp: z.string(),

	// Status
	validated: z.number(),
	rejected: z.number(),

	// Data
	body,
	headers,
}
export type TBRequest = ZodMapped<typeof schema>
const parameters = {
	workspace_id: z.string(),
	source_id: z
		.string()
		.transform<string | undefined>((val) => {
			return val.split(".") as any
		})
		.optional(),
	request_id: z.string().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
}
export type TBRequestParameters = ZodMapped<typeof parameters>

const kpiSchema = {
	date: z.string(),
	workspace_id: z.string(),
	events: z.number(),
	sources: z.number(),
}
export type TBKpiRequest = ZodMapped<typeof kpiSchema>
const kpiParameters = {
	workspace_id: z.string(),
	start_date: z.string(),
	end_date: z.string().optional(),
	period: period.default("daily").optional(),
	source_id: z.string().optional(),
}
export type TBKpiRequestParameters = ZodMapped<typeof kpiParameters>

const timelineSchema = {
	date: z.string(),
	workspace_id: z.string(),
	source_id: z.string(),
	events: z.number(),
}
export type TBTimelineRequest = ZodMapped<typeof timelineSchema>
const timelineParameters = {
	workspace_id: z.string(),
	source_id: z.string().optional(),
	start_date: z.string(),
	end_date: z.string().optional(),
	period: period.default("daily").optional(),
}
export type TBTimelineRequestParameters = ZodMapped<typeof timelineParameters>

export const buildTinyBirdRequest = (tb: Tinybird) => {
	const builder = new TinybirdResourceBuilder({
		tb,
		name: "request",
	})

	const get = builder.build({
		name: "get",
		schema: schema,
		parameters: parameters,
		datasource: "request_events",
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
