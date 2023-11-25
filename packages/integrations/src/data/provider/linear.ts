import { z } from "zod"
import { createIntegrationForm } from "../../types"
export const linearForm = createIntegrationForm({
	name: "linear",
	schema: {
		webhookSigningSecret: {
			validator: z.string(),
			inputProps: {
				placeholder: "Secret key...",
			},
			description: "The webhook signing secret for your Linear account.",
		},
	},
})
