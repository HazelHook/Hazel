import { z } from "zod"
import { createIntegrationForm } from "../../types"
export const githubForm = createIntegrationForm({
	name: "github",
	schema: {
		webhookSigningSecret: {
			validator: z.string(),
			inputProps: {
				placeholder: "Secret key...",
			},
			description: "The webhook signing secret for your GitHub account.",
		},
	},
})
