import { z } from "zod"

import { createIntegrationForm, InferIntegrationType } from "../../types"

export type LinearProviderProps = InferIntegrationType<typeof linearForm>

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
