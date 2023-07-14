import { createIntegrationForm } from "../common";


export const apiKeyForm = createIntegrationForm({
	name: "api_key",
	schema: {
		username: {
			type: "text",
			label: "API Key Header",
			description: "The header key that contains the signature. This is usually `X-API-Signature`.",
		},
		password: {
			type: "secret",
			label: "API Key",
		},
	},
})
