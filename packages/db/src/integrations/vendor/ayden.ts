import { createIntegrationForm } from "../common"

//https://docs.adyen.com/development-resources/webhooks
export const aydenForm = createIntegrationForm({
	name: "ayden",
	schema: {
		webhookSigningSecret: {
			type: "secret",
			label: "Ayden ",
			placeholder: "Webhook secret...",
		},
	},
})
