import { notFound, redirect } from "next/navigation"
import { Destination } from "@hazel/db/src/drizzle/schema"
import { Tiny } from "@hazel/db/src/tinybird"
import { Card, CardHeader, CardTitle } from "@hazel/ui/card"
import { Chart } from "@hazel/ui/chart"
import { DataTable } from "@hazel/ui/data-table"
import { sub } from "date-fns"

import { auth } from "@/lib/auth"
import { getCachedSource } from "@/lib/orm"
import { chartColors, formatDateTime } from "@/lib/utils"
import { transformSourcesChartData } from "@/app/[locale]/(pages)/_utils"

import { columns } from "./column"

const SourcePage = async ({
	params,
}: {
	params: {
		id: string
	}
}) => {
	const source = await getCachedSource({ publicId: params.id })
	const startTime = formatDateTime(sub(new Date(), { days: 7 }))

	if (!source) {
		notFound()
	}

	const { workspaceId } = await auth()

	if (source.workspaceId !== workspaceId) {
		redirect("/")
	}

	const tiny = Tiny(process.env.TINY_TOKEN!)
	const req = await tiny.request.timeline({
		workspace_id: workspaceId,
		source_id: source.publicId,
		start_date: startTime,
	})

	const chartData = transformSourcesChartData(req.data)

	return (
		<main className="space-y-4">
			<div className="flex flex-row justify-between mb-4">
				<div className="p-2">
					<p className="text-lg font-semibold">Overview</p>
				</div>
			</div>
			<div className="flex flex-row gap-2 w-full">
				<div className="min-w-max">
					<DataTable
						rootPath="/destination"
						columns={columns}
						data={
							(source.connections.map((conn) => conn.destination).filter(Boolean) as Destination[]) || []
						}
					/>
				</div>

				<div className="w-full">
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
		</main>
	)
}

// export const runtime = "edge"

export default SourcePage
