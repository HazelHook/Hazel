import { z } from "zod"

import { createIntegrationForm } from "../../types"

export const mailgunForm = createIntegrationForm({
	name: "mailgun",
	schema: {
		webhookSigningSecret: {
			validator: z.string(),
			inputProps: {
				placeholder: "Secret key...",
			},
			description: "The webhook signing secret for your mailgun account.",
		},
	},
})
