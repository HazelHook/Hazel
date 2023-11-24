import { createIntegrationForm } from "../../types"
export const mailgunForm = createIntegrationForm({
	name: "mailgun",
	schema: {
		webhookSigningSecret: {
			type: "secret",
			label: "Webhook Signing Secret",
			placeholder: "Secret key...",
			description: "The webhook signing secret for your mailgun account.",
		},
	},
})
