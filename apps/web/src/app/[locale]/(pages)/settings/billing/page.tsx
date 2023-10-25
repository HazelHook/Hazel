import { PlanCard } from "@/app/[locale]/(pages)/settings/billing/components/plan-card"
import { auth } from "@/lib/auth"
import Alert, { AlertHeading } from "@hazel/ui/alert"
import { Container } from "@hazel/ui/container"
import { lago } from "@hazel/utils/lago"
import { PaymentSection } from "./components/payment-section"
import { BillingTable } from "./components/billing-table"
import { Card } from "@hazel/ui/card"
import { PageHeader } from "@hazel/ui/page-header"
import { InvoiceTable } from "./components/invoice-table"
import { format } from "date-fns"
import Heading from "@hazel/ui/heading"

export default async function BillingPage() {
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

	const {
		data: { billable_metrics: metrics },
	} = await lago.billableMetrics.findAllBillableMetrics()

	const currentPlan = plans.find((plan) => plan.code === subscription.plan_code)

	console.log(workspaceId)
	return (
		<Container>
			<PageHeader
				title="Billing"
				subtitle="Update your account settings. Set your preferred language and timezone."
			/>
			<div className="flex w-full flex-col justify-center gap-6">
				<div>
					<Heading type={3}>Your current plan</Heading>
					<p className="text-muted-foreground text-sm">Upgrade, cancel or switch your subscription plan</p>
				</div>

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
			<div className="flex w-full flex-col justify-center gap-6">
				<Heading type={3}>Payment Methods</Heading>
				<PaymentSection workspaceId={workspaceId} />
			</div>
			<div className="flex w-full flex-col justify-center gap-6">
				<div>
					<Heading type={3}>Pricing Breakdown</Heading>
					<p className="text-muted-foreground text-sm">A breakdown of your current billing cycle</p>
				</div>

				<Card className="w-full max-w-5xl">
					<BillingTable usage={usage} currentPlan={currentPlan!} />
				</Card>
			</div>
			<div className="flex w-full flex-col justify-center gap-6">
				<div>
					<Heading type={3}>Invoices</Heading>
					<p className="text-muted-foreground text-sm">All your invoices in one place</p>
				</div>
				<Card className="w-full max-w-5xl">
					<InvoiceTable workspaceID={workspaceId} />
				</Card>
			</div>
		</Container>
	)
}
