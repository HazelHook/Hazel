import { currentUser } from "@clerk/nextjs"
import { sub } from "date-fns"
import { Tiny } from "db/src/tinybird"

import { auth } from "@/lib/auth"
import { chartColors, formatDateTime, getSeededProfileImageUrl, subtractFromString } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart } from "@/components/ui/chart"

import { DatePicker } from "./_component/DatePicker"
import { KpiCard } from "./_component/KpiCard"
import { transformSourcesChartData } from "./_utils"

interface DashboardPageProps {
	searchParams: {
		period?: string
		date_from?: string
		date_to?: string
	}
}

const Dashboard = async ({ searchParams }: DashboardPageProps) => {
	const { userId } = auth()

	const tiny = Tiny(process.env.TINY_TOKEN!)

	const endTime = searchParams.date_to || formatDateTime(new Date())
	const startTime =
		searchParams.date_from ||
		formatDateTime(subtractFromString(new Date(), searchParams.period || "7d") || sub(new Date(), { days: 7 }))

	const reqKpisPromise = tiny.getReqKpis({
		customer_id: userId,
		start_date: startTime,
		end_date: endTime,
	})
	const resKpisPromise = tiny.getResKpis({
		customer_id: userId,
		success: 1,
		start_date: startTime,
		end_date: endTime,
	})

	const errorKpisPromise = tiny.getResKpis({
		customer_id: userId,
		success: 0,
		start_date: startTime,
		end_date: endTime,
	})

	const bySourcesPromise = tiny.getReqTimeseries({
		customer_id: userId,
		start_date: startTime,
		end_date: endTime,
	})

	const userPromise = currentUser()

	const [reqKpis, resKpis, errorKpis, bySources, user] = await Promise.all([
		reqKpisPromise,
		resKpisPromise,
		errorKpisPromise,
		bySourcesPromise,
		userPromise,
	])

	const chartData = transformSourcesChartData(bySources.data)
	return (
		<main className="container p-8 space-y-4">
			<div className="flex flex-row justify-between">
				<div className="flex flex-row gap-2">
					<Avatar className="w-16 h-16">
						<AvatarImage src={getSeededProfileImageUrl(userId)} />
					</Avatar>
					<div className="flex justify-center flex-col">
						<h3 className="text-2xl">Welcome back, {user?.username}</h3>
						<p className="text-muted-foreground">Happy to see you again on your dashboard.</p>
					</div>
				</div>
				<div>
					<DatePicker />
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

// export const fetchCache = "force-no-store"

export const runtime = "edge"

export default Dashboard
