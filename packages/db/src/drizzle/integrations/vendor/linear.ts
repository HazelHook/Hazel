import { createIntegrationForm } from "../common";

export const linearForm = createIntegrationForm({
	name: "linear",
	schema: {
		webhookSigningSecret: {
			type: "secret",
			label: "Webhook Signing Secret",
			placeholder: "Secret key...",
			description:
				"The webhook signing secret for your Linear account.",
		},
	},
})
