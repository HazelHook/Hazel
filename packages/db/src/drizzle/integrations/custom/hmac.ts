import { createIntegrationForm } from "../common";


export const hmacForm = createIntegrationForm({
	name: "hmac",
	schema: {
		algorithm: {
			type: "select",
			label: "Algorithm",
			placeholder: "Select...",
			options: ["SHA-1", "SHA-256", "SHA-512", "MD5"],
		},
		encoding: {
			type: "select",
			label: "Encoding",
			placeholder: "Select...",
			options: ["Hex", "base64"],
		},
		signature_header: {
			type: "text",
			label: "Signature Header Key",
			placeholder: "Enter the header key...",
			description: "The header key that contains the signature. This is usually `X-API-Signature`.",
		},
		signature_secret: {
			type: "secret",
			label: "Signature Secret",
			placeholder: "Enter the secret...",
			description: "The secret used to sign the webhook payload.",
		},
	},
})
