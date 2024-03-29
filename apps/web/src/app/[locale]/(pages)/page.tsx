import { Suspense } from "react"
import Link from "next/link"

import { auth } from "@/lib/auth"
import { getTableParams } from "@/lib/data-table-helpers"
import { chartColors, formatDateTime, subtractFromString } from "@/lib/utils"
import { requestTableSearchParamsSchema, responseTableSearchParamsSchema } from "@/lib/validators/params"

import { db } from "@hazel/db"
import tiny, { TBRequest, TBResponse } from "@hazel/tinybird"
import { Avatar, AvatarFallback, AvatarImage } from "@hazel/ui/avatar"
import { Await } from "@hazel/ui/await"
import { buttonVariants } from "@hazel/ui/button"
import { Container } from "@hazel/ui/container"
import { DataTableLoading } from "@hazel/ui/data-table"
import { ReloadButton } from "@hazel/ui/reload-button"
import { Skeleton } from "@hazel/ui/skeleton"
import { Tabs, TabsContent, TabsTrigger, UnstyledTabsList } from "@hazel/ui/tabs"
import { sub } from "date-fns"

import { DatePicker } from "./_component/date-picker"
import { KpiCard, KpiLoadingCard } from "./_component/KpiCard"
import { RequestTable } from "./_component/request-table"
import { ResponseTable } from "./_component/response-table"
import { IconPlus } from "@tabler/icons-react"

interface DashboardPageProps {
	searchParams: {
		period?: string
		date_from?: string
		date_to?: string
	}
}

const Dashboard = async ({ searchParams }: DashboardPageProps) => {
	const { workspaceId, user } = await auth()

	const { sort, offset, limit, source_id, destination_id, response_id, status, success } = getTableParams(
		searchParams,
		requestTableSearchParamsSchema.merge(responseTableSearchParamsSchema),
	)

	const endTime = searchParams.date_to || formatDateTime(new Date())
	const startTime =
		searchParams.date_from ||
		formatDateTime(
			searchParams.period ? subtractFromString(new Date(), searchParams.period)! : sub(new Date(), { days: 7 }),
		)

	const requests = tiny.request.get({
		workspace_id: workspaceId,
		source_id,
		limit,
		offset,
	})

	const response = tiny.response.get({
		workspace_id: workspaceId,
		source_id,
		destination_id,
		response_id,
		status,
		limit,
		success,
		offset,
	})

	const kpiRequest = tiny.request.kpi({
		workspace_id: workspaceId,
		start_date: startTime,
		end_date: endTime,
	})

	const kpiResponse = tiny.response.kpi({
		workspace_id: workspaceId,
		// success: 1,
		start_date: startTime,
		end_date: endTime,
	})

	const kpiError = tiny.response.kpi({
		workspace_id: workspaceId,
		success: 0,
		start_date: startTime,
		end_date: endTime,
	})

	const pSources = await db.source.getMany({
		workspaceId,
	})

	const pDestinations = await db.destination.getMany({
		workspaceId,
	})

	const [sources, destinations] = await Promise.all([pSources, pDestinations])

	return (
		<Container>
			<div className="flex flex-row justify-between">
				<div className="flex flex-row gap-2">
					<Suspense fallback={<Skeleton className="w-16 h-16 rounded-full" />}>
						<Avatar className="w-16 h-16">
							<AvatarImage src={user.profileImage!} />
							<AvatarFallback />
						</Avatar>
					</Suspense>

					<div className="flex justify-center flex-col">
						<h3 className="text-2xl">Welcome back, {user.name}</h3>
						<p className="text-muted-foreground">Happy to see you again on your dashboard.</p>
					</div>
				</div>
				<div>
					<Link href="/connection/new" className={buttonVariants()}>
						<IconPlus className="mr-2" />
						New Connection
					</Link>
				</div>
			</div>

			<div className="flex gap-4 flex-col md:flex-row">
				<Await
					key="events-loader"
					promise={kpiRequest}
					fallback={<KpiLoadingCard key="events-loader" color={chartColors[0]} title={"Events"} />}
				>
					{({ data }) => (
						<KpiCard
							key={"events"}
							color={chartColors[0]}
							title={"Events"}
							subtitle={String(data.reduce((curr, el) => curr + el.events, 0))}
							id={"events"}
							series={[
								{
									name: "Events",
									data: data.map((datum) => datum.events),
								},
							]}
							labels={data.map((datum) => formatDateTime(new Date(datum.date)))}
						/>
					)}
				</Await>

				<Await
					key="requests-loader"
					promise={kpiResponse}
					fallback={<KpiLoadingCard key="requests-loader" color={chartColors[1]} title={"Request"} />}
				>
					{({ data }) => (
						<KpiCard
							key={"requests"}
							color={chartColors[1]}
							title={"Requests"}
							subtitle={String(data.reduce((curr, el) => curr + el.requests, 0))}
							id={"req"}
							group="kpis"
							series={[
								{
									name: "Requests",
									data: data.map((datum) => datum.requests),
								},
							]}
							labels={data.map((datum) => formatDateTime(new Date(datum.date)))}
						/>
					)}
				</Await>

				<Await
					key="errors-loader"
					promise={kpiError}
					fallback={<KpiLoadingCard key="errors-loader" color={chartColors[3]} title={"Errors"} />}
				>
					{({ data }) => (
						<KpiCard
							key={"errors"}
							color={chartColors[3]}
							title={"Errors"}
							subtitle={String(data.reduce((curr, el) => curr + el.requests, 0))}
							id={"errors"}
							group="kpis"
							series={[
								{
									name: "Errors",
									data: data.map((datum) => datum.requests),
								},
							]}
							labels={data.map((datum) => formatDateTime(new Date(datum.date)))}
						/>
					)}
				</Await>
			</div>
			<Tabs defaultValue="request">
				<UnstyledTabsList className="flex flex-row justify-between">
					<div className="flex flex-row bg-muted p-1 text-muted-foreground rounded-md">
						<TabsTrigger value="request">Requests</TabsTrigger>
						<TabsTrigger value="response">Responses</TabsTrigger>
					</div>

					<div className="flex flex-row gap-4">
						<ReloadButton />
						<DatePicker />
					</div>
				</UnstyledTabsList>
				<TabsContent value="request">
					<Await
						promise={buildRequestTableData(response, requests)}
						fallback={<DataTableLoading columnCount={5} />}
					>
						{({ data, rows_before_limit_at_least }) => (
							<RequestTable
								maxItems={rows_before_limit_at_least || data.length}
								data={data}
								sources={sources}
								destinations={destinations}
							/>
						)}
					</Await>
				</TabsContent>
				<TabsContent value="response">
					<Await promise={response} fallback={<DataTableLoading columnCount={5} />}>
						{({ data, rows_before_limit_at_least }) => (
							<ResponseTable
								maxItems={rows_before_limit_at_least || data.length}
								data={data}
								sources={sources}
								destinations={destinations}
							/>
						)}
					</Await>
				</TabsContent>
			</Tabs>
		</Container>
	)
}

const buildRequestTableData = async (
	res: Promise<{ data: TBResponse[] }>,
	req: Promise<{ data: TBRequest[]; rows_before_limit_at_least?: number }>,
) => {
	const [resData, reqData] = await Promise.all([res, req])

	const mappedData = reqData.data.map((req) => {
		const responses = resData.data.filter((res) => res.request_id === req.id)

		return { ...req, responses: responses }
	})

	return {
		data: mappedData,
		rows_before_limit_at_least: reqData.rows_before_limit_at_least,
	}
}

export const runtime = "edge"

export default Dashboard
