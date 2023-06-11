import { Tinybird } from "@chronark/zod-bird"
import { z } from "zod"

export const Tiny = (token: string) => {
	const tb = new Tinybird({ token })

	const publishRequestEvent = tb.buildIngestEndpoint({
		datasource: "request_events",
		event: z.object({
			timestamp: z.string(),
			version: z.string(),
			request_id: z.string(),
			customer_id: z.string(),
			source_id: z.string(),

			body: z.string(),
			headers: z.string(),
		}),
	})

	const publishResponseEvent = tb.buildIngestEndpoint({
		datasource: "response_events",
		event: z.object({
			timestamp: z.string(),
			version: z.string(),
			request_id: z.string(),
			customer_id: z.string(),
			source_id: z.string(),
			status: z.number(),
			success: z.number(),

			body: z.string(),
			headers: z.string(),
		}),
	})

	const getReqKpis = tb.buildPipe({
		pipe: "kpi_req",
		parameters: z.object({
			customer_id: z.string(),
		}),
		data: z.object({
			source_id: z.string(),
			customer_id: z.string(),
			events: z.number(),
			date: z.string(),
		}),
	})

	const getResKpis = tb.buildPipe({
		pipe: "kpi_res",
		parameters: z.object({
			customer_id: z.string(),
			success: z.number().min(0).max(1).optional(),
		}),
		data: z.object({
			source_id: z.string(),
			customer_id: z.string(),
			requests: z.number(),
			date: z.string(),
		}),
	})

	return { publishRequestEvent, publishResponseEvent, getResKpis, getReqKpis }
}
