import { ChargeObject, CustomerChargeUsageObject } from "lago-javascript-client"

import { dashboardNumberFormatter } from "@/lib/formatters"

import { RadialProgressBar } from "@hazel/ui/radial-progress"

interface UsageCardProps {
	item: CustomerChargeUsageObject
	charge: ChargeObject
}

export const UsageCard = ({ item, charge }: UsageCardProps) => {
	const currUsage = Number(item.units)
	const freeUnits = Number((charge.properties as any).free_units)

	const usagePer = Math.round((currUsage / freeUnits) * 100)

	return (
		<div className="flex flex-col items-center justify-center">
			<RadialProgressBar progress={usagePer} strokeWidth={4} size={80} />
			<p className="mt-4 text-center text-lg font-semibold">{item.billable_metric.name}</p>
			<p className="text-md text-center font-semibold">{dashboardNumberFormatter().format(currUsage)}</p>
			<p className="text-center text-sm text-muted-foreground">of {freeUnits}</p>
		</div>
	)
}
