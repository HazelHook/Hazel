import { redirect } from "next/navigation"
import { sub } from "date-fns"

import { auth } from "@/lib/auth"
import { getCachedConnection } from "@/lib/orm"
import tiny from "@/lib/tiny"
import { chartColors, formatDateTime } from "@/lib/utils"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart } from "@/components/ui/chart"
import { KpiCard } from "@/app/[locale]/(pages)/_component/KpiCard"
import { transformSourcesChartData } from "@/app/[locale]/(pages)/_utils"

const SourcePage = async ({
	params,
}: {
	params: {
		id: string
	}
}) => {
	const connection = await getCachedConnection({ publicId: params.id })

	const { workspaceId } = await auth()

	if (connection.workspaceId !== workspaceId) {
		redirect("/")
	}

	const startTime = formatDateTime(sub(new Date(), { days: 7 }))

	const pRequestKpis = tiny.request.kpi({
		workspace_id: workspaceId,
		source_id: connection.source?.publicId || "",
		start_date: startTime,
	})

	const pResponseKpis = tiny.response.kpi({
		workspace_id: workspaceId,
		source_id: connection.source?.publicId || "",
		// success: 1,
		start_date: startTime,
	})

	const pErrorResponseKpis = tiny.response.kpi({
		workspace_id: workspaceId,
		source_id: connection.source?.publicId || "",
		// success: 0,
		start_date: startTime,
	})

	const pRequestTimeline = tiny.request.timeline({
		workspace_id: workspaceId,
		source_id: connection.source?.publicId || "",
		start_date: startTime,
	})

	const [requestKpis, responseKpis, errorKpis, requestTimeline] = await Promise.all([
		pRequestKpis,
		pResponseKpis,
		pErrorResponseKpis,
		pRequestTimeline,
	])

	const chartData = transformSourcesChartData(requestTimeline.data)

	return (
		<div className="space-y-4">
			<div className="flex gap-4 flex-col md:flex-row">
				<KpiCard
					color={chartColors[0]}
					title={"Events"}
					subtitle={String(requestKpis.data.reduce((curr, el) => curr + el.events, 0))}
					group="kpis"
					id={"events"}
					series={[
						{
							name: "Events",
							data: requestKpis.data.map((datum) => datum.events),
						},
					]}
					labels={requestKpis.data.map((datum) => formatDateTime(new Date(datum.date)))}
				/>
				<KpiCard
					color={chartColors[1]}
					title={"Requests"}
					subtitle={String(responseKpis.data.reduce((curr, el) => curr + el.requests, 0))}
					id={"req"}
					group="kpis"
					series={[
						{
							name: "Requests",
							data: responseKpis.data.map((datum) => datum.requests),
						},
					]}
					labels={requestKpis.data.map((datum) => formatDateTime(new Date(datum.date)))}
				/>
				<KpiCard
					color={chartColors[3]}
					title={"Errors"}
					subtitle={String(errorKpis.data.reduce((curr, el) => curr + el.requests, 0))}
					id={"errors"}
					group="kpis"
					series={[
						{
							name: "Errors",
							data: errorKpis.data.map((datum) => datum.requests),
						},
					]}
					labels={errorKpis.data.map((datum) => datum.date)}
				/>
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
				<Card className="col-span-full w-full h-full overflow-hidden">
					<CardHeader>
						<CardTitle>Usage Overview</CardTitle>
					</CardHeader>

					<div className="w-full p-6">
						<Chart
							options={{
								chart: {
									id: "wow",
									sparkline: {
										enabled: false,
									},
									toolbar: {
										show: false,
									},
								},
								colors: chartColors,
								legend: {
									show: true,
									position: "top",
								},
								dataLabels: {
									enabled: false,
								},
								stroke: {
									width: [2, 2, 2],
									curve: "smooth",
								},
								xaxis: {
									type: "datetime",
									categories: chartData.categories,
								},
								tooltip: {
									x: {
										format: "dd/MM/yy HH:mm",
									},
								},
							}}
							series={chartData.series}
							type="area"
							height={350}
							width={"100%"}
						/>
					</div>
				</Card>
			</div>
		</div>
	)
}

// export const runtime = "edge"

export default SourcePage
