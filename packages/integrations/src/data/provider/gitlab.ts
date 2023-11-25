import { z } from "zod"
import { createIntegrationForm } from "../../types"
export const gitlabForm = createIntegrationForm({
	name: "gitlab",
	schema: {
		webhookSigningSecret: {
			validator: z.string(),
			inputProps: {
				placeholder: "Secret key...",
			},
			description: "The webhook signing secret for your GitLab account.",
		},
	},
})
