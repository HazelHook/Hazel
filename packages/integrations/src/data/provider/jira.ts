import { z } from "zod"

import { createIntegrationForm } from "../../types"

export const jiraForm = createIntegrationForm({
	name: "jira",
	schema: {
		webhookSigningSecret: {
			validator: z.string(),
			inputProps: {
				placeholder: "Secret key...",
			},
			description:
				"The webhook signing secret for your Stripe account. [Click here](https://dashboard.stripe.com/webhooks) to access the secret in Stripe.",
		},
	},
})
