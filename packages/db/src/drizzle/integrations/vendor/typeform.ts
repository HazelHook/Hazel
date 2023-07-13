import { createIntegrationForm } from "../common";

export const typeformForm = createIntegrationForm({
	name: "typeform",
	schema: {
		webhookSigningSecret: {
			type: "secret",
			label: "Webhook Signing Secret",
			placeholder: "Secret key...",
			description:
				"The webhook signing secret for your Typeform account.",
		},
	},
})
