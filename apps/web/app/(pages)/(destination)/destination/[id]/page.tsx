import { notFound, redirect } from "next/navigation"
import { auth } from "@clerk/nextjs"
import { sub } from "date-fns"
import { Tiny } from "db/src/tinybird"

import { getCachedDestination } from "@/lib/orm"
import { chartColors, formatDateTime } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart } from "@/components/ui/chart"
import { transformDestinationsChartData, transformSourcesChartData } from "@/app/(pages)/_utils"

const DestinationPage = async ({
	params,
}: {
	params: {
		id: string
	}
}) => {
	const destination = await getCachedDestination({ publicId: params.id })

	const startTime = formatDateTime(sub(new Date(), { days: 7 }))

	const { userId } = auth()

	if (!destination) {
		notFound()
	}

	if (destination.customerId !== userId) {
		redirect("/")
	}

	const tiny = Tiny(process.env.TINY_TOKEN!)

	const req = await tiny.response.timeline({
		customer_id: userId,

		start_date: startTime,
	})

	const chartData = transformDestinationsChartData(req.data)

	return (
		<main className="space-y-4">
			<div className="flex flex-row justify-between mb-4">
				<div className="p-2">
					<p className="text-lg font-semibold">Overview</p>
				</div>
				<div className={buttonVariants()}>Add Destination TODO:</div>
			</div>
			<div className="flex flex-row gap-2 w-full">
				{/* <DataTable
					rootPath="/destination"
					columns={columns}
					data={(destination.connections.map((conn) => conn.destination).filter(Boolean) as Destination[]) || []}
				/> */}
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

export default DestinationPage
