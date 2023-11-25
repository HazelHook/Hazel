import { z } from "zod"
import { createIntegrationForm } from "../../types"
//https://docs.adyen.com/development-resources/webhooks
export const aydenForm = createIntegrationForm({
	name: "ayden",
	schema: {
		webhookSigningSecret: {
			validator: z.string(),
			inputProps: {
				placeholder: "Secret key...",
			},
			placeholder: "Webhook secret...",
		},
	},
})
