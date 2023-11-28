import { notFound, redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { getCachedDestination } from "@/lib/orm"
import { chartColors, formatDateTime } from "@/lib/utils"
import { transformDestinationsChartData } from "@/app/[locale]/(pages)/_utils"

import tiny from "@hazel/tinybird"
import { Card, CardHeader, CardTitle } from "@hazel/ui/card"
import { Chart } from "@hazel/ui/chart"
import { sub } from "date-fns"
import { Tile } from "@hazel/ui/tile"
import { CopyButton } from "@/components/copy-button"
import Link from "next/link"
import { ExternalLink01Icon } from "@hazel/icons"
import { buttonVariants } from "@hazel/ui/button"
import { and, db, eq } from "@hazel/db"

const DestinationPage = async ({
	params,
}: {
	params: {
		id: string
	}
}) => {
	const { workspaceId } = await auth()

	const destination = await db.db.query.destination.findFirst({
		where: (dest) => and(eq(dest.publicId, params.id), eq(dest.workspaceId, workspaceId)),
		with: {
			connections: true,
		},
	})

	const startTime = formatDateTime(sub(new Date(), { days: 7 }))

	if (!destination) {
		notFound()
	}

	const req = await tiny.response.timeline({
		workspace_id: workspaceId,
		start_date: startTime,
	})

	const chartData = transformDestinationsChartData(req.data)

	return (
		<main className="space-y-4">
			<div className="flex flex-row justify-between mb-4">
				<div className="p-2">
					<p className="text-lg font-semibold">Overview</p>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full justify-between">
				<Tile className="w-full">
					<Tile.Heading>Destination ID</Tile.Heading>
					<Tile.Body>
						<CopyButton value={destination.publicId} />
					</Tile.Body>
				</Tile>
				<Tile className="w-full">
					<Tile.Heading>Connections</Tile.Heading>
					<Tile.Body>
						<div className="flex justify-between items-center">
							{destination.connections.length}
							<Link
								href={`/webhooks?destination=${destination.publicId}`}
								className={buttonVariants({ variant: "outline", size: "icon" })}
							>
								<ExternalLink01Icon className="w-4 h-4" />
							</Link>
						</div>
					</Tile.Body>
				</Tile>
			</div>
			<div className="flex flex-row gap-2 w-full">
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
