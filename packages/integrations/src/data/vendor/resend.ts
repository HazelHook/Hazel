import { InferIntegrationType, createIntegrationForm } from "../../types"
import { svixSecretValidator } from "./svix"

export type ResendProviderProps = InferIntegrationType<typeof resendForm>

export const resendForm = createIntegrationForm({
	name: "resend",
	schema: {
		webhookSigningSecret: {
			label: "Webhook Signing Secret",
			validator: svixSecretValidator,
			placeholder: "API key...",
			description:
				"The webhook API key for your Resend account. You can find it [here](https://resend.com/webhooks).",
		},
	},
})
