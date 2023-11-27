import { changeDefaultMethodAction, createCheckoutAction, removePaymentMethodAction } from "@/server/actions/stripe"

import { Spinner } from "@hazel/ui/spinner"
import { lago } from "@hazel/utils/lago"
import { stripe, type Stripe } from "@hazel/utils/stripe"

import { AddPaymentButton } from "./add-payment-button"
import { CreditCard } from "./credit-card"

interface PaymentSectionProps {
	workspaceId: string
}

export const PaymentSection = async ({ workspaceId }: PaymentSectionProps) => {
	const {
		data: { customer },
	} = await lago.customers.findCustomer(workspaceId)

	if (!customer.billing_configuration?.provider_customer_id) {
		return (
			<div className="m-auto">
				<Spinner />
			</div>
		)
	}

	const stripeCustomer = (await stripe.customers.retrieve(
		customer.billing_configuration?.provider_customer_id!,
	)) as Stripe.Customer

	const paymentMethods = await stripe.paymentMethods.list({
		customer: stripeCustomer.id,
		type: "card",
	})

	const currDefault = stripeCustomer.invoice_settings.default_payment_method

	return (
		<div>
			<div className="grid grid-cols-1 items-center justify-center gap-4 sm:grid-cols-2 md:grid-cols-3">
				{paymentMethods.data.map((method) => (
					<CreditCard
						key={method.id}
						isDefault={method.id === currDefault}
						name={method.billing_details.name!}
						brand={method.card?.brand!}
						last4Digits={method.card?.last4!}
						expiryDate={`${method.card?.exp_month}/
					${method.card?.exp_year}`}
						country={method.card?.country!}
						methodId={method.id}
						stripeCustomerId={stripeCustomer.id}
						changeDefaultMethodAction={changeDefaultMethodAction}
						removePaymentMethodAction={removePaymentMethodAction}
					/>
				))}

				<AddPaymentButton stripeCustomerId={stripeCustomer.id} createCheckoutAction={createCheckoutAction} />
			</div>
		</div>
	)
}
