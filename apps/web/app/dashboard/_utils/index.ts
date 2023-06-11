import { SourceTimeSeries } from "db/src/tinybird"

export const transformSourcesChartData = (data: SourceTimeSeries[]) => {
	return data.reduce(
		// rome-ignore lint/suspicious/noExplicitAny: <explanation>
		(result: { series: any[]; categories: string[] }, obj) => {
			let series = result.series.find((series) => series.name === obj.source_id)
			if (!series) {
				series = { name: obj.source_id, data: [] }
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
