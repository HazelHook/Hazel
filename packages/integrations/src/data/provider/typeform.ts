import { z } from "zod"

import { createIntegrationForm } from "../../types"

export const typeformForm = createIntegrationForm({
	name: "typeform",
	schema: {
		webhookSigningSecret: {
			validator: z.string(),
			inputProps: {
				placeholder: "Secret key...",
			},
			description: "The webhook signing secret for your Typeform account.",
		},
	},
})
