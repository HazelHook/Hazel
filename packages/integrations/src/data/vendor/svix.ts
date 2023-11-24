import { createIntegrationForm } from "../../types"

export type SvixProviderProps = {
	webhookSigningSecret: string
}

export const svixForm = createIntegrationForm({
	name: "svix",
	schema: {
		webhookSigningSecret: {
			type: "secret",
			label: "Webhook Signing Secret",
			placeholder: "Secret key...",
			description: "The webhook signing secret for your Svix account should have this format: whsec_xxxx... ",
		},
	},
})
