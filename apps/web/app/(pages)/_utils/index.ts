import { TBTimelineRequest } from "db/src/tinybird/model/tiny-request";
import { TBTimelineResponse } from "db/src/tinybird/model/tiny-response";

export const transformSourcesChartData = (data: TBTimelineRequest[]) => {
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

export const transformDestinationsChartData = (data: TBTimelineResponse[]) => {
	return data.reduce(
		(result: { series: any[]; categories: string[] }, obj) => {
			let series = result.series.find((series) => series.name === (obj as any).destination_id) // TODO
			if (!series) {
				series = { name: (obj as any).destination_id, data: [] }
				result.series.push(series)
			}
			series.data.push(obj.events)
			if (!result.categories.includes(obj.date)) {
				result.categories.push(obj.date)
			}
			return result
		},
		{ series: [], categories: [] },
	)
}
