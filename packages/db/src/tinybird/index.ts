import { Tinybird } from "@chronark/zod-bird"
import { z } from "zod"

const sourceTimeSeriesRes = z.object({
	date: z.string(),
	customer_id: z.string(),
	source_id: z.string(),
	events: z.number(),
})

export type SourceTimeSeries = z.infer<typeof sourceTimeSeriesRes>

const period = z.enum(["daily", "hourly", "weekly", "monthly"])

const baseParams = z.object({
	start_date: z.string(),

	end_date: z.string().optional(),

	period: period.default("daily").optional(),
})

const eventRes = z.object({
	timestamp: z.string(),
	version: z.string(),
	request_id: z.string(),
	customer_id: z.string(),
	source_id: z.string(),
	destination_id: z.string(),

	status: z.number(),
	success: z.number(),

	body: z.string(),
	headers: z.string(),
})

const eventReq = z.object({
	timestamp: z.string(),
	version: z.string(),
	request_id: z.string(),
	customer_id: z.string(),
	source_id: z.string(),

	body: z.string(),
	headers: z.string(),
})

export const Tiny = (token: string) => {
	const tb = new Tinybird({ token })

	const publishRequestEvent = tb.buildIngestEndpoint({
		datasource: "request_events",
		event: eventReq,
	})

	const publishResponseEvent = tb.buildIngestEndpoint({
		datasource: "response_events",
		event: eventRes,
	})

	const getReqKpis = tb.buildPipe({
		pipe: "kpi_req",
		parameters: baseParams.merge(
			z.object({
				customer_id: z.string(),
				source_id: z.string().optional(),
			}),
		),
		data: z.object({
			customer_id: z.string(),
			events: z.number(),
			sources: z.number(),
			date: z.string(),
		}),
	})

	const getResKpis = tb.buildPipe({
		pipe: "kpi_res",
		parameters: baseParams.merge(
			z.object({
				customer_id: z.string(),
				source_id: z.string().optional(),
				success: z.number(),
			}),
		),
		data: z.object({
			customer_id: z.string(),
			requests: z.number(),
			sources: z.number(),
			date: z.string(),
		}),
	})

	const getReqTimeseries = tb.buildPipe({
		pipe: "req_timeline",
		parameters: baseParams.merge(
			z.object({
				customer_id: z.string(),
				source_id: z.string().optional(),
			}),
		),
		data: sourceTimeSeriesRes,
	})

	const getResTimeseries = tb.buildPipe({
		pipe: "res_timeline",
		parameters: baseParams.merge(
			z.object({
				customer_id: z.string(),
				source_id: z.string().optional(),
			}),
		),
		data: sourceTimeSeriesRes.merge(
			z.object({
				status: z.number(),
			}),
		),
	})

	const getReq = tb.buildPipe({
		pipe: "get_req",
		parameters: z.object({
			customer_id: z.string(),
			source_id: z.string().optional(),
			limit: z.number().optional(),
			offset: z.number().optional(),
		}),
		data: eventReq,
	})

	const getRes = tb.buildPipe({
		pipe: "get_res",
		parameters: z.object({
			customer_id: z.string(),
			source_id: z.string().optional(),
			destionation_id: z.string().optional(),
			limit: z.number().optional(),
			offset: z.number().optional(),
		}),
		data: eventRes,
	})

	return {
		publishRequestEvent,
		publishResponseEvent,
		getResKpis,
		getReqKpis,
		getResTimeseries,
		getReqTimeseries,
		getRes,
		getReq,
	}
}
