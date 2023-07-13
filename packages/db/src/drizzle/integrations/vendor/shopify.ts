import { createIntegrationForm } from "../common";

export const shopifyForm = createIntegrationForm({
	name: "shopify",
	schema: {
		webhookSigningSecret: {
			type: "secret",
			label: "Webhook Signing Secret",
			placeholder: "Secret key...",
			description:
				"The webhook signing secret for your Shopify account.",
		},
	},
})
