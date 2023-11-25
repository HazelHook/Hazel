import { z } from "zod"
import { createIntegrationForm } from "../../types"
export const shopifyForm = createIntegrationForm({
	name: "shopify",
	schema: {
		webhookSigningSecret: {
			validator: z.string(),
			inputProps: {
				placeholder: "Secret key...",
			},
			description: "The webhook signing secret for your Shopify account.",
		},
	},
})
