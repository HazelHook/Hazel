import { RequestEventTimeSeries } from "db/src/tinybird/request/zod-request-data"
import { ResponseEventTimeSeries } from "db/src/tinybird/response/zod-response-data";

export const transformSourcesChartData = (data: RequestEventTimeSeries[]) => {
	return data.reduce(
		(result: { series: any[]; categories: string[] }, obj) => {
			let series = result.series.find((series) => series.name === obj.source_id)
			if (!series) {
				series = { name: obj.source_id, data: [] }
				result.series.push(series)
			}
			series.data.push(obj.events)
			if (!result.categories.includes(obj.date.toString())) {
				result.categories.push(obj.date.toString())
			}
			return result
		},
		{ series: [], categories: [] },
	)
}

export const transformDestinationsChartData = (data: ResponseEventTimeSeries[]) => {
	return data.reduce(
		(result: { series: any[]; categories: string[] }, obj) => {
			let series = result.series.find((series) => series.name === obj.destination_id)
			if (!series) {
				series = { name: obj.destination_id, data: [] }
				result.series.push(series)
			}
			series.data.push(obj.events)
			if (!result.categories.includes(obj.date.toString())) {
				result.categories.push(obj.date.toString())
			}
			return result
		},
		{ series: [], categories: [] },
	)
}
