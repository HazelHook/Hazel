import { Tinybird } from "@chronark/zod-bird"

import { responseEvent, responseEventKpis, responseEventTimeSeries } from "./zod-response-data"
import { getResponseKpisParams, getResponseParams, getResponseTimeseriesParams } from "./zod-response-params"

export const buildTinyBirdResponse = (tb: Tinybird) => {
	const publish = tb.buildIngestEndpoint({
		datasource: "event_responses",
		event: responseEvent,
	})

	const get = tb.buildPipe({
		pipe: "responses",
		parameters: getResponseParams,
		data: responseEvent,
	})

	const getKpis = tb.buildPipe({
		pipe: "kpi_responses",
		parameters: getResponseKpisParams,
		data: responseEventKpis,
	})

	const getTimeseries = tb.buildPipe({
		pipe: "timeline_responses",
		parameters: getResponseTimeseriesParams,
		data: responseEventTimeSeries,
	})

	return {
		publish,
		get,
		getKpis,
		getTimeseries,
	}
}
