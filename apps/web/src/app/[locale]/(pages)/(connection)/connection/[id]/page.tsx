import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { getCachedConnection } from "@/lib/orm"
import { chartColors, formatDateTime } from "@/lib/utils"
import { transformSourcesChartData } from "@/app/[locale]/(pages)/_utils"

import tiny from "@hazel/tinybird"
import { Card, CardHeader, CardTitle } from "@hazel/ui/card"
import { Chart } from "@hazel/ui/chart"
import { sub } from "date-fns"
import { Tile } from "@hazel/ui/tile"
import { CopyButton } from "@/components/copy-button"
import Link from "next/link"
import { buttonVariants } from "@hazel/ui/button"
import { IconExternalLink, IconLogin } from "@tabler/icons-react"

const SourcePage = async ({
	params,
}: {
	params: {
		id: string
	}
}) => {
	const connection = await getCachedConnection({ publicId: params.id })

	const { workspaceId } = await auth()

	if (connection.workspaceId !== workspaceId) {
		redirect("/")
	}

	const startTime = formatDateTime(sub(new Date(), { days: 7 }))

	const pRequestKpis = tiny.request.kpi({
		workspace_id: workspaceId,
		source_id: connection.source?.publicId || "",
		start_date: startTime,
	})

	const pResponseKpis = tiny.response.kpi({
		workspace_id: workspaceId,
		source_id: connection.source?.publicId || "",
		// success: 1,
		start_date: startTime,
	})

	const pErrorResponseKpis = tiny.response.kpi({
		workspace_id: workspaceId,
		source_id: connection.source?.publicId || "",
		// success: 0,
		start_date: startTime,
	})

	const pRequestTimeline = tiny.request.timeline({
		workspace_id: workspaceId,
		source_id: connection.source?.publicId || "",
		start_date: startTime,
	})

	const [requestKpis, responseKpis, errorKpis, requestTimeline] = await Promise.all([
		pRequestKpis,
		pResponseKpis,
		pErrorResponseKpis,
		pRequestTimeline,
	])

	const chartData = transformSourcesChartData(requestTimeline.data)

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full justify-between">
				<Tile className="w-full">
					<Tile.Heading>Connection ID</Tile.Heading>
					<Tile.Body>
						<CopyButton value={connection.publicId} />
					</Tile.Body>
				</Tile>
				<Tile className="w-full">
					<Tile.Heading>Source</Tile.Heading>
					<Tile.Body>
						<div className="flex justify-between items-center">
							<Link
								className={buttonVariants({ variant: "link", size: "none" })}
								href={`/source/${connection.source.publicId}`}
							>
								{connection.source.integration?.tool ? (
									<img
										src={`/assets/integrations/${connection.source.integration.tool}.svg`}
										alt={connection.source.integration.tool}
										className="w-4 h-4 mr-2"
									/>
								) : (
									<IconLogin className="w-4 h-4 text-muted-foreground" />
								)}
								{connection.source.name}
							</Link>
							<Link
								href={`/source/${connection.source.publicId}`}
								className={buttonVariants({ variant: "outline", size: "icon" })}
							>
								<IconExternalLink className="w-4 h-4" />
							</Link>
						</div>
					</Tile.Body>
				</Tile>
				<Tile className="w-full">
					<Tile.Heading>Destination</Tile.Heading>
					<Tile.Body>
						<div className="flex justify-between items-center">
							<Link
								className={buttonVariants({ variant: "link", size: "none", className: "text-2xl" })}
								href={`/destination/${connection.source.publicId}`}
							>
								{connection.destination.name}
							</Link>
							<Link
								href={`/destination/${connection.destination.publicId}`}
								className={buttonVariants({ variant: "outline", size: "icon" })}
							>
								<IconExternalLink className="w-4 h-4" />
							</Link>
						</div>
					</Tile.Body>
				</Tile>
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
				<Card className="col-span-full w-full h-full overflow-hidden">
					<CardHeader>
						<CardTitle>Connection Metrics</CardTitle>
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
	)
}

export const runtime = "edge"

export default SourcePage
