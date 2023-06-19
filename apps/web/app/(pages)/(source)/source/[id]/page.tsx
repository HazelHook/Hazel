import { notFound, redirect } from "next/navigation"
import { auth } from "@clerk/nextjs"

import { buttonVariants } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./column"
import { getCachedSource } from "@/lib/orm"
import { Connection, Destination } from "db/src/schema"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart } from "@/components/ui/chart"
import { Tiny } from "db/src/tinybird"
import { chartColors } from "@/lib/utils"
import { transformSourcesChartData } from "@/app/(pages)/_utils"

const SourcePage = async ({
	params,
}: {
	params: {
		id: string
	}
}) => {
	const source = await getCachedSource({ publicId: params.id })

	const { userId } = auth()

	if (!source) {
		notFound()
	}

	if (source.customerId !== userId) {
		redirect("/")
	}

	// rome-ignore lint/style/noNonNullAssertion: <explanation>
	const tiny = Tiny(process.env.TINY_TOKEN!)

	const res = await tiny.getReqTimeseries({ customer_id: userId, source_id: source.publicId })

	const chartData = transformSourcesChartData(res.data)

	console.log(source.connections.map((conn) => conn.destination).filter(Boolean))

	return (
		<main className="space-y-4">
			<div className="flex flex-row justify-between mb-4">
				<div className="p-2">
					<p className="text-lg font-semibold">Overview</p>
				</div>
				<div className={buttonVariants()}>Add Destination TODO:</div>
			</div>
			<div className="flex flex-row gap-2 w-full">
				<DataTable
					rootPath="/destination"
					columns={columns}
					data={(source.connections.map((conn) => conn.destination).filter(Boolean) as Destination[]) || []}
				/>
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

export const runtime = "edge"

export default SourcePage
