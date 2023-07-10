import { currentUser } from "@clerk/nextjs"
import { sub } from "date-fns"

import { auth } from "@/lib/auth"
import tiny from "@/lib/tiny"
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

	const endTime = searchParams.date_to || formatDateTime(new Date())
	const startTime =
		searchParams.date_from ||
		formatDateTime(
			searchParams.period ? subtractFromString(new Date(), searchParams.period)! : sub(new Date(), { days: 7 }),
		)

	const kpiRequestPromise = tiny.request.kpi({
		customer_id: userId,
		start_date: startTime,
		end_date: endTime,
	})
	const kpiResponsePromise = tiny.response.kpi({
		customer_id: userId,
		// success: 1,
		start_date: startTime,
		end_date: endTime,
	})

	const kpiErrorPromise = tiny.response.kpi({
		customer_id: userId,
		// success: 0,
		start_date: startTime,
		end_date: endTime,
	})

	const timeseriesBySourcePromise = tiny.request.timeline({
		customer_id: userId,
		start_date: startTime,
		end_date: endTime,
	})

	const userPromise = currentUser()

	const [kpiRequests, kpiResponses, kpiErrors, timelineBySources, user] = await Promise.all([
		kpiRequestPromise,
		kpiResponsePromise,
		kpiErrorPromise,
		timeseriesBySourcePromise,
		userPromise,
	])

	const chartData = transformSourcesChartData(timelineBySources.data)
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
					subtitle={String(kpiRequests.data.reduce((curr, el) => curr + el.events, 0))}
					group="kpis"
					id={"events"}
					series={[
						{
							name: "Events",
							data: kpiRequests.data.map((datum) => datum.events),
						},
					]}
					labels={kpiRequests.data.map((datum) => formatDateTime(new Date(datum.date)))}
				/>
				<KpiCard
					color={chartColors[1]}
					title={"Requests"}
					subtitle={String(kpiResponses.data.reduce((curr, el) => curr + el.requests, 0))}
					id={"req"}
					group="kpis"
					series={[
						{
							name: "Requests",
							data: kpiResponses.data.map((datum) => datum.requests),
						},
					]}
					labels={kpiRequests.data.map((datum) => formatDateTime(new Date(datum.date)))}
				/>
				<KpiCard
					color={chartColors[3]}
					title={"Errors"}
					subtitle={String(kpiErrors.data.reduce((curr, el) => curr + el.requests, 0))}
					id={"errors"}
					group="kpis"
					series={[
						{
							name: "Errors",
							data: kpiErrors.data.map((datum) => datum.requests),
						},
					]}
					labels={kpiErrors.data.map((datum) => formatDateTime(new Date(datum.date)))}
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
