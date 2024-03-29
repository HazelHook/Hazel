import { z } from "zod"

import { createIntegrationForm, InferIntegrationType } from "../../types"

export type SvixProviderProps = InferIntegrationType<typeof svixForm>

export const svixSecretValidator = z.string().regex(/^whsec_.*/, {
	message: "Invalid format: The Secret must start with 'whsec_'",
})

export const svixForm = createIntegrationForm({
	name: "svix",
	schema: {
		webhookSigningSecret: {
			validator: svixSecretValidator,
			inputProps: {
				placeholder: "Secret key...",
			},
			description: "The webhook signing secret for your Svix account should have this format: whsec_xxxx... ",
		},
	},
})
