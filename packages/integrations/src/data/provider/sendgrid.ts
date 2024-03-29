import { z } from "zod"

import { createIntegrationForm } from "../../types"

export const sendgridForm = createIntegrationForm({
	name: "sendgrid",
	schema: {
		webhookSigningSecret: {
			validator: z.string(),
			inputProps: {
				placeholder: "Secret key...",
			},
			description: "The webhook signing secret for your Sendgrid account.",
		},
	},
})
