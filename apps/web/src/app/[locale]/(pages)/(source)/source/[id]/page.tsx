import { notFound, redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { getCachedSource } from "@/lib/orm"
import { chartColors, formatDateTime } from "@/lib/utils"
import { transformSourcesChartData } from "@/app/[locale]/(pages)/_utils"

import { Destination } from "@hazel/db/schema"
import tiny from "@hazel/tinybird"
import { Card, CardHeader, CardTitle } from "@hazel/ui/card"
import { Chart } from "@hazel/ui/chart"
import { SimpleDataTable } from "@hazel/ui/data-table"
import { sub } from "date-fns"

import { columns } from "./column"
import { Tile } from "@hazel/ui/tile"
import { CopyButton } from "@/components/copy-button"
import { SourceCopyButton } from "@/components/source-copy-button"
import Link from "next/link"
import { ExternalLink01Icon } from "@hazel/icons"
import { buttonVariants } from "@hazel/ui/button"

const SourcePage = async ({
	params,
}: {
	params: {
		id: string
	}
}) => {
	const { workspaceId } = await auth()

	const source = await getCachedSource({ publicId: params.id, workspaceId })
	const startTime = formatDateTime(sub(new Date(), { days: 7 }))

	if (!source) {
		notFound()
	}

	if (source.workspaceId !== workspaceId) {
		redirect("/")
	}

	const req = await tiny.request.timeline({
		workspace_id: workspaceId,
		source_id: source.publicId,
		start_date: startTime,
	})

	console.log(req)

	const chartData = transformSourcesChartData(req.data)

	return (
		<div className="w-full space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full justify-between">
				<Tile className="w-full">
					<Tile.Heading>Source ID</Tile.Heading>
					<Tile.Body>
						<CopyButton value={source.publicId} />
					</Tile.Body>
				</Tile>
				<Tile className="w-full">
					<Tile.Heading>Source URL</Tile.Heading>
					<Tile.Body>
						<SourceCopyButton sourceId={source.publicId} />
					</Tile.Body>
				</Tile>
				<Tile className="w-full">
					<Tile.Heading>Connections</Tile.Heading>
					<Tile.Body>
						<div className="flex justify-between items-center">
							{source.connections.length}
							<Link
								href={`/webhooks?source=${source.publicId}`}
								className={buttonVariants({ variant: "outline", size: "icon" })}
							>
								<ExternalLink01Icon className="w-4 h-4" />
							</Link>
						</div>
					</Tile.Body>
				</Tile>
			</div>
			<div className="w-full">
				<Card className="col-span-full w-full h-full overflow-hidden">
					<CardHeader>
						<CardTitle>Source Metrics</CardTitle>
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
			<div className="min-w-max">
				<SimpleDataTable
					rootPath="/destination"
					columns={columns}
					data={(source.connections.map((conn) => conn.destination).filter(Boolean) as Destination[]) || []}
				/>
			</div>
		</div>
	)
}

export const runtime = "edge"

export default SourcePage
