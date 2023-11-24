import { createIntegrationForm } from "../../types"

export const sendgridForm = createIntegrationForm({
	name: "sendgrid",
	schema: {
		webhookSigningSecret: {
			type: "secret",
			label: "Webhook Signing Secret",
			placeholder: "Secret key...",
			description: "The webhook signing secret for your Sendgrid account.",
		},
	},
})
