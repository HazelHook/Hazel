import { Card } from "@hazel/ui/card"
import { Chart } from "@hazel/ui/chart"

import { chartColors } from "@/lib/utils"

export interface KpiCardProps {
	title: string
	subtitle: string
	series: ApexAxisChartSeries | ApexNonAxisChartSeries
	labels: string[]
	group?: string
	id?: string
	color?: string
}

export const KpiCard = ({ series, labels, title, subtitle, group, id, color }: KpiCardProps) => {
	return (
		<Card className="w-full h-[140px] overflow-hidden">
			<div className="pt-4">
				<Chart
					options={{
						chart: {
							id: id,
							group: group,
							sparkline: {
								enabled: true,
							},
						},
						stroke: {
							width: [2],
							curve: "straight",
						},
						fill: {
							opacity: 1,
						},
						colors: color ? [color] : chartColors,
						labels: labels,
						yaxis: {
							min: 0,
							labels: {
								minWidth: 100,
								show: false,
							},
						},
						xaxis: {
							type: "datetime",
							labels: {
								show: false,
							},
						},
						title: {
							text: title,
							offsetX: 5,
							style: {
								fontFamily: "Roboto, sans-serif",
								fontSize: "12px",
								fontWeight: "500",
							},
						},
						subtitle: {
							text: subtitle,
							offsetX: 5,
							offsetY: 15,
							style: {
								fontFamily: "Roboto, sans-serif",
								fontSize: "22px",
								fontWeight: "500",
							},
						},
					}}
					series={series}
					type="area"
					height={120}
					width={"100%"}
				/>
			</div>
		</Card>
	)
}

export const KpiLoadingCard = ({
	color,
	title,
	subtitle,
}: {
	title: string
	subtitle?: string
	group?: string
	id?: string
	color?: string
}) => (
	<KpiCard
		title={title}
		subtitle={subtitle || "Loading..."}
		series={[{ name: "Loading", data: [1, 1, 1, 1, 1, 1, 1] }]}
		labels={[]}
		color={color}
	/>
)
