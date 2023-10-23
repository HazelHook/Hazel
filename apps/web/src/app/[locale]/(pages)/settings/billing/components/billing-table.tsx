import { format } from "date-fns"
import { CustomerUsageObject, PlanObject } from "lago-javascript-client"

import { currencyFormatter, dashboardNumberFormatter } from "@/lib/formatters"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@hazel/ui/table"

export interface CustomerUsageObjectProps {
	usage: CustomerUsageObject
	currentPlan: PlanObject
}

export const BillingTable = ({ usage, currentPlan }: CustomerUsageObjectProps) => {
	const getUsagePlan = (code: string) => {
		return currentPlan.charges?.find((c) => c.billable_metric_code === code)!
	}

	const getIncludedString = (code: string) => {
		const plan = getUsagePlan(code)

		const properties: any = plan.properties

		if (Number(properties.free_units) === 0 || !properties.free_units) {
			return "-"
		}

		return dashboardNumberFormatter().format(properties.free_units)
	}

	const getPriceString = (code: string) => {
		const plan = getUsagePlan(code)

		const properties: any = plan.properties

		if (Number(properties.amount) === 0 && plan.charge_model === "package") {
			return "-"
		}

		if (Number(properties.amount) === 0) {
			return "Unlimited"
		}

		return `${currencyFormatter(currentPlan.amount_currency).format(
			properties.amount,
		)} per ${dashboardNumberFormatter().format(properties.package_size)}`
	}

	return (
		<Table className="w-full">
			<TableCaption className="mb-4">
				Billing Cycle from {format(new Date(usage.from_datetime), "MM/dd/yyyy")} to{" "}
				{format(new Date(usage.to_datetime), "MM/dd/yyyy")}.
			</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Item</TableHead>
					<TableHead>Count</TableHead>
					<TableHead>Included</TableHead>
					<TableHead>Additonal Unit Price</TableHead>
					<TableHead className="text-right">Total Price</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{usage.charges_usage.map((charge, index) => (
					<TableRow key={index}>
						<TableCell>{charge.billable_metric.name}</TableCell>
						<TableCell>{dashboardNumberFormatter().format(Number(charge.units))}</TableCell>
						<TableCell>{getIncludedString(charge.billable_metric.code!)}</TableCell>
						<TableCell>{getPriceString(charge.billable_metric.code!)}</TableCell>
						<TableCell className="text-right">
							{currencyFormatter(charge.amount_currency).format(charge.amount_cents / 100)}
						</TableCell>
					</TableRow>
				))}
				<TableRow>
					<TableCell>Total Extra Costs</TableCell>
					<TableCell>-</TableCell>
					<TableCell>-</TableCell>
					<TableCell>-</TableCell>
					<TableCell className="text-right">
						{currencyFormatter(usage.currency).format(usage.amount_cents / 100)}
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>Base Cost ({currentPlan.name})</TableCell>
					<TableCell>-</TableCell>
					<TableCell>-</TableCell>
					<TableCell>-</TableCell>
					<TableCell className="text-right">
						{currencyFormatter(currentPlan.amount_currency).format(currentPlan.amount_cents / 100)}
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>Total Cost</TableCell>
					<TableCell>-</TableCell>
					<TableCell>-</TableCell>
					<TableCell>-</TableCell>
					<TableCell className="text-right">
						{currencyFormatter(currentPlan.amount_currency).format(
							(currentPlan.amount_cents + usage.amount_cents) / 100,
						)}
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	)
}
