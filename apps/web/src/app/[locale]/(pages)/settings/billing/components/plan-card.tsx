import { BillableMetricObject, PlanObject } from "lago-javascript-client"

import { currencyFormatter, dashboardNumberFormatter } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@hazel/ui/card"
import { CheckTickCircleIcon } from "@hazel/icons"
import { CheckoutButton } from "@/app/[locale]/(pages)/settings/billing/components/checkout-button"
import { changeSubscribtionAction, unsubscribeAction } from "@/server/actions/billing"
import { CancelButton } from "@/app/[locale]/(pages)/settings/billing/components/cancel-button"

export interface PlanCardProps {
	plan: PlanObject
	currentPlanId: string
	currentSubscriptionId: string
	metrics: BillableMetricObject[]
}

export const PlanCard = ({ plan, currentPlanId, currentSubscriptionId, metrics }: PlanCardProps) => {
	return (
		<Card
			className={cn("w-full md:w-[240px]", plan.lago_id === currentPlanId && "border-primary")}
			key={plan.lago_id}
		>
			<CardHeader>
				<CardTitle className="font-normal">{plan.name}</CardTitle>
				<div className="flex flex-row gap-2">
					<CardTitle className="flex flex-row text-3xl">
						{currencyFormatter(plan.amount_currency).format(plan.amount_cents / 100)}
					</CardTitle>
					<div>
						<p className="text-xs">{plan.amount_currency.toUpperCase()}</p>
						<p className="text-xs text-muted-foreground">billed {plan.interval}</p>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{(plan.charges || []).map((feature) => (
					<div key={feature.lago_id} className="flex flex-row items-center gap-2">
						<CheckTickCircleIcon className="h-4 w-4 text-primary" />
						<p className="text-sm">
							{`${dashboardNumberFormatter().format((feature.properties as any).free_units)} ${
								metrics.find((metric) => metric.code === feature.billable_metric_code)?.name
							} included`}
						</p>
					</div>
				))}
			</CardContent>
			<CardFooter>
				{plan.lago_id === currentPlanId && plan.code !== "free" ? (
					<CancelButton subscriptionId={currentSubscriptionId} unsubscribeAction={unsubscribeAction} />
				) : (
					<CheckoutButton
						previousSubscriptionId={currentSubscriptionId}
						planId={plan.code}
						disabled={plan.lago_id === currentPlanId}
						subscribeAction={changeSubscribtionAction}
					/>
				)}
			</CardFooter>
		</Card>
	)
}
