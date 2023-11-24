import { createIntegrationForm } from "../../types"
export const resendForm = createIntegrationForm({
	name: "resend",
	schema: {
		apiKey: {
			type: "secret",
			label: "API Key",
			placeholder: "API key...",
			description:
				"The webhook API key for your Resend account. You can find it [here](https://resend.com/onboarding).",
		},
	},
})
