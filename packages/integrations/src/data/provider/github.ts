import { z } from "zod"
import { InferIntegrationType, createIntegrationForm } from "../../types"

export type GithubProviderProps = InferIntegrationType<typeof githubForm>

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
