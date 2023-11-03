import { auth } from "@/lib/auth"
import { DoubleChevronUpIcon } from "@hazel/icons"
import Alert, { AlertHeading } from "@hazel/ui/alert"
import { Button } from "@hazel/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@hazel/ui/card"
import { Container } from "@hazel/ui/container"
import { Separator } from "@hazel/ui/separator"
import { lago } from "@hazel/utils/lago"
import Link from "next/link"
import { BillingTable } from "../billing/components/billing-table"
import { UsageCard } from "./component/usage-card"
import { PageHeader } from "@hazel/ui/page-header"

export default async function UsagePage() {
	const { workspaceId } = await auth()

	const {
		data: { subscriptions },
	} = await lago.subscriptions.findAllSubscriptions({
		external_customer_id: workspaceId,
	})

	const subscription = subscriptions[0]

	if (!subscription) {
		return (
			<Container>
				<Alert type={"error"}>
					<AlertHeading>You don't have a subscription</AlertHeading>
					Please contact suppport to get this resolved!
				</Alert>
			</Container>
		)
	}

	const {
		data: { customer_usage: usage },
	} = await lago.customers.findCustomerCurrentUsage(workspaceId, {
		external_subscription_id: subscription.external_id,
	})

	const {
		data: { plans },
	} = await lago.plans.findAllPlans()

	const currentPlan = plans.find((plan) => plan.code === subscription.plan_code)

	return (
		<Container>
			<PageHeader title="Usage" subtitle="Your current usage for this month." />

			<Card>
				<CardHeader className="flex flex-row justify-between">
					<CardTitle className="mt-2">
						Current Usage <span className="font-bold text-primary">({currentPlan?.name} Plan)</span>
					</CardTitle>
					<Link href={"/settings/billing"}>
						<Button variant="outline">
							<DoubleChevronUpIcon className="mr-2" />
							Upgrade Plan
						</Button>
					</Link>
				</CardHeader>
				<CardContent className="mt-4 flex flex-col flex-wrap justify-center gap-4 md:flex-row">
					{usage.charges_usage.map((use, index) => (
						<UsageCard
							item={use}
							key={index}
							charge={
								currentPlan?.charges?.find(
									(charge) => charge.billable_metric_code === use.billable_metric.code,
								)!
							}
						/>
					))}
				</CardContent>
			</Card>

			<div className="flex w-full flex-col justify-center gap-6">
				<Card className="w-full max-w-5xl">
					<BillingTable usage={usage} currentPlan={currentPlan!} />
				</Card>
			</div>
		</Container>
	)
}

export const runtime = "edge"
