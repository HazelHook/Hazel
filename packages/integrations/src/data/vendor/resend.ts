import { createIntegrationForm } from "../../types"
export const resendForm = createIntegrationForm({
	name: "resend",
	schema: {
		webhookSigningSecret: {
			type: "secret",
			label: "Webhook Signing Secret",
			placeholder: "API key...",
			description:
				"The webhook API key for your Resend account. You can find it [here](https://resend.com/webhooks).",
		},
	},
})
