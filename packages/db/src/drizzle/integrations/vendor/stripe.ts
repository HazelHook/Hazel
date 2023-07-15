import { createIntegrationForm } from "../common"

export const stripeForm = createIntegrationForm({
	name: "stripe",
	schema: {
		webhookSigningSecret: {
			type: "secret",
			label: "Webhook Signing Secret",
			placeholder: "Secret key...",
			description:
				"The webhook signing secret for your Stripe account. [Click here](https://dashboard.stripe.com/webhooks) to access the secret in Stripe.",
		},
	},
})
