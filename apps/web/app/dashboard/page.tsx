import { Tiny } from "db/src/tinybird"

import { chartColors, getSeededProfileImageUrl } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart } from "@/components/ui/chart"

import { KpiCard } from "./_component/KpiCard"
import { transformSourcesChartData } from "./_utils"

const Dashboard = async () => {
	// rome-ignore lint/style/noNonNullAssertion: <explanation>
	const tiny = Tiny(process.env.TINY_TOKEN!)

	const reqKpis = await tiny.getReqKpis({
		customer_id: "cus_8NiWC2t_SZVKALuy",
	})
	const resKpis = await tiny.getResKpis({
		customer_id: "cus_8NiWC2t_SZVKALuy",
		success: 1,
	})

	const errorKpis = await tiny.getResKpis({
		customer_id: "cus_8NiWC2t_SZVKALuy",
		success: 0,
	})

	const bySources = await tiny.getTimeseriesBySource({ customer_id: "cus_8NiWC2t_SZVKALuy" })

	const chartData = transformSourcesChartData(bySources.data)
	return (
		<main className="container p-8 space-y-4">
			<div className="flex flex-row gap-2">
				<Avatar className="w-16 h-16">
					<AvatarImage src={getSeededProfileImageUrl("12")} />
				</Avatar>
				<div className="flex justify-center flex-col">
					<h3 className="text-2xl">Welcome back, Makisuo</h3>
					<p className="text-muted-foreground">Happy to see you again on your dashboard.</p>
				</div>
			</div>
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
		</main>
	)
}

export const fetchCache = "force-no-store"

export default Dashboard
