import { createIntegrationForm } from "../common"

export const apiKeyForm = createIntegrationForm({
	name: "api_key",
	schema: {
		username: {
			type: "text",
			label: "API Key Header",
		},
		password: {
			type: "secret",
			label: "API Key",
		},
	},
})
