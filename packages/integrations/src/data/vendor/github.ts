import { createIntegrationForm } from "../../types"
export const githubForm = createIntegrationForm({
	name: "github",
	schema: {
		webhookSigningSecret: {
			type: "secret",
			label: "Webhook Signing Secret",
			placeholder: "Secret key...",
			description: "The webhook signing secret for your GitHub account.",
		},
	},
})
