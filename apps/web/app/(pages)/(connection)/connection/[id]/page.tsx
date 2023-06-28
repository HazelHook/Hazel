import { redirect } from "next/navigation"
import { sub } from "date-fns"
import { Tiny } from "db/src/tinybird"

import { auth } from "@/lib/auth"
import { getCachedConnection } from "@/lib/orm"
import { chartColors, formatDateTime } from "@/lib/utils"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart } from "@/components/ui/chart"
import { KpiCard } from "@/app/(pages)/_component/KpiCard"
import { transformSourcesChartData } from "@/app/(pages)/_utils"

const SourcePage = async ({
	params,
}: {
	params: {
		id: string
	}
}) => {
	const connection = await getCachedConnection({ publicId: params.id })

	const { userId } = auth()

	if (connection.customerId !== userId) {
		redirect("/")
	}

	const startTime = formatDateTime(sub(new Date(), { days: 7 }))

	// rome-ignore lint/style/noNonNullAssertion: <explanation>
	const tiny = Tiny(process.env.TINY_TOKEN!)

	const pReqKpis = tiny.getReqKpis({
		customer_id: userId,
		source_id: connection.source?.publicId || "",
		start_date: startTime,
	})

	const pResKpis = tiny.getResKpis({
		customer_id: userId,
		source_id: connection.source?.publicId || "",
		success: 1,
		start_date: startTime,
	})

	const pErrorKpis = tiny.getResKpis({
		customer_id: userId,
		source_id: connection.source?.publicId || "",
		success: 0,
		start_date: startTime,
	})

	const pBySources = tiny.getReqTimeseries({
		customer_id: userId,
		source_id: connection.source?.publicId || "",
		start_date: startTime,
	})

	const [reqKpis, resKpis, errorKpis, bySources] = await Promise.all([pReqKpis, pResKpis, pErrorKpis, pBySources])

	const chartData = transformSourcesChartData(bySources.data)

	return (
		<div className="space-y-4">
			<div className="flex gap-4 flex-col md:flex-row">
				<KpiCard
					color={chartColors[0]}
					title={"Events"}
					subtitle={String(reqKpis.data.reduce((curr, el) => curr + el.events, 0))}
					group="kpis"
					id={"events"}
					series={[{ name: "Events", data: reqKpis.data.map((datum) => datum.events) }]}
					labels={reqKpis.data.map((datum) => datum.date)}
				/>
				<KpiCard
					color={chartColors[1]}
					title={"Requests"}
					subtitle={String(resKpis.data.reduce((curr, el) => curr + el.requests, 0))}
					id={"req"}
					group="kpis"
					series={[
						{
							name: "Requests",
							data: resKpis.data.map((datum) => datum.requests),
						},
					]}
					labels={reqKpis.data.map((datum) => datum.date)}
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

export const runtime = "edge"

export default SourcePage
