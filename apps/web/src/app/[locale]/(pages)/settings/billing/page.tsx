import { PlanCard } from "@/app/[locale]/(pages)/settings/billing/components/plan-card"
import { auth } from "@/lib/auth"
import Alert, { AlertHeading } from "@hazel/ui/alert"
import { Container } from "@hazel/ui/container"
import { Separator } from "@hazel/ui/separator"
import { createCustomer, lago } from "@hazel/utils/lago"

export default async function BillingPage() {
	const { workspaceId, organization, user } = await auth()

	await createCustomer({ workspaceId, name: organization.name, legalName: user.name!, email: user.email! })
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

	console.log(subscriptions)

	const {
		data: { customer_usage: usage },
	} = await lago.customers.findCustomerCurrentUsage(workspaceId, {
		external_subscription_id: subscription.external_id,
	})

	const {
		data: { plans },
	} = await lago.plans.findAllPlans()

	const {
		data: { billable_metrics: metrics },
	} = await lago.billableMetrics.findAllBillableMetrics()

	const currentPlan = plans.find((plan) => plan.code === subscription.plan_code)

	return (
		<Container>
			<div>
				<h3 className="text-lg font-medium">Billing</h3>
				<p className="text-sm text-muted-foreground">
					Update your account settings. Set your preferred language and timezone.
				</p>
			</div>
			<Separator />
			<div className="flex w-full flex-col justify-center gap-6">
				<h4 className="text-lg font-medium">Your Current Plan</h4>
				<div className="flex flex-col justify-center gap-4 md:flex-row">
					{plans.map((plan) => (
						<PlanCard
							key={plan.lago_id}
							plan={plan}
							currentPlanId={currentPlan!.lago_id}
							currentSubscriptionId={subscription.external_id}
							metrics={metrics}
						/>
					))}
				</div>
			</div>
			{/* <div className="flex w-full flex-col justify-center gap-6">
				<h4 className="text-lg font-medium">Payment Methods</h4>
				<PaymentSection externalId={externalId}></PaymentSection>
			</div>
			<div className="flex w-full flex-col justify-center gap-6">
				<h4 className="text-lg font-medium">Pricing Breakdown</h4>
				<Card className="w-full max-w-5xl">
					<BillingTable usage={usage} currentPlan={currentPlan!}></BillingTable>
				</Card>
			</div> */}
		</Container>
	)
}
