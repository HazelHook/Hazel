import { Suspense } from "react"
import Link from "next/link"
import { currentUser } from "@clerk/nextjs"
import { formatDistanceToNow, sub } from "date-fns"

import { auth } from "@/lib/auth"
import tiny from "@/lib/tiny"
import { chartColors, formatDateTime, subtractFromString } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge } from "@/components/StatusBadge"
import { SourceLink } from "@/app/(pages)/_component/SourceLink"

import { DatePicker } from "./_component/DatePicker"
import { KpiCard, KpiLoadingCard } from "./_component/KpiCard"
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

	const requests = tiny.request.get({
		workspace_id: userId,
		limit: 5,
	})

	const kpiRequest = tiny.request.kpi({
		workspace_id: userId,
		start_date: startTime,
		end_date: endTime,
	})

	const kpiResponse = tiny.response.kpi({
		workspace_id: userId,
		// success: 1,
		start_date: startTime,
		end_date: endTime,
	})

	const kpiError = tiny.response.kpi({
		workspace_id: userId,
		// success: 0,
		start_date: startTime,
		end_date: endTime,
	})

	const user = currentUser()

	const timelineBySources = await tiny.request.timeline({
		workspace_id: userId,
		start_date: startTime,
		end_date: endTime,
	})

	const chartData = transformSourcesChartData(timelineBySources.data)

	return (
		<main className="container p-8 space-y-4">
			<div className="flex flex-row justify-between">
				<div className="flex flex-row gap-2">
					<Suspense fallback={<Skeleton className="w-16 h-16 rounded-full" />}>
						<Avatar className="w-16 h-16">
							<AvatarImage src={(await user)?.profileImageUrl} />
							<AvatarFallback />
						</Avatar>
					</Suspense>

					<Suspense>
						<div className="flex justify-center flex-col">
							<h3 className="text-2xl">Welcome back, {(await user)?.username}</h3>
							<p className="text-muted-foreground">Happy to see you again on your dashboard.</p>
						</div>
					</Suspense>
				</div>
				<div>
					<DatePicker />
				</div>
			</div>

			<div className="flex gap-4 flex-col md:flex-row">
				<Suspense fallback={<KpiLoadingCard color={chartColors[0]} title={"Events"} />}>
					<KpiCard
						color={chartColors[0]}
						title={"Events"}
						subtitle={String((await kpiRequest).data.reduce((curr, el) => curr + el.events, 0))}
						group="kpis"
						id={"events"}
						series={[
							{
								name: "Events",
								data: (await kpiRequest).data.map((datum) => datum.events),
							},
						]}
						labels={(await kpiRequest).data.map((datum) => formatDateTime(new Date(datum.date)))}
					/>
				</Suspense>

				<Suspense fallback={<KpiLoadingCard color={chartColors[1]} title={"Request"} />}>
					<KpiCard
						color={chartColors[1]}
						title={"Requests"}
						subtitle={String((await kpiResponse).data.reduce((curr, el) => curr + el.requests, 0))}
						id={"req"}
						group="kpis"
						series={[
							{
								name: "Requests",
								data: (await kpiResponse).data.map((datum) => datum.requests),
							},
						]}
						labels={(await kpiResponse).data.map((datum) => formatDateTime(new Date(datum.date)))}
					/>
				</Suspense>

				<Suspense fallback={<KpiLoadingCard color={chartColors[3]} title={"Errors"} />}>
					<KpiCard
						color={chartColors[3]}
						title={"Errors"}
						subtitle={String((await kpiError).data.reduce((curr, el) => curr + el.requests, 0))}
						id={"errors"}
						group="kpis"
						series={[
							{
								name: "Errors",
								data: (await kpiError).data.map((datum) => datum.requests),
							},
						]}
						labels={(await kpiError).data.map((datum) => formatDateTime(new Date(datum.date)))}
					/>
				</Suspense>
			</div>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:grid-cols-3">
				<Card className="col-span-2 w-full h-full overflow-hidden">
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
				<Card className="col-span-1">
					<CardHeader>
						<CardTitle>Recent Events</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						{(await requests).data.map((request) => (
							<div key={request.id} className="flex flex-row gap-2 justify-between">
								<div className="flex flex-row gap-4 justify-center items-center max-w-[70%] overflow-hidden">
									<div className="flex flex-col gap-1">
										<SourceLink sourceId={request.source_id} />
										<Link
											href={`/request/${request.id}`}
											className="text-muted-foreground text-sm underline-offset-4 text-ellipsis hover:underline"
										>
											{request.id.replace("req_", "")}
										</Link>
									</div>
								</div>

								<div className="flex flex-col gap-2 justify-end items-end">
									{
										<p className="text-sm">
											{formatDistanceToNow(new Date(request.timestamp), {
												addSuffix: true,
											})}
										</p>
									}
									<StatusBadge status={request.rejected ? "error" : "success"} />
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</main>
	)
}

// export const fetchCache = "force-no-store"

export const runtime = "edge"

export default Dashboard
