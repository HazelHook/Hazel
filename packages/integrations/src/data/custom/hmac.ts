import { createIntegrationForm } from "../../types"

export type HmacProviderProps = {
	algorithm: "SHA-384" | "SHA-256" | "SHA-512"
	encoding: "hex" | "base64" | "binary"
	signature_header: string
	signature_secret: string
}

export const hmacForm = createIntegrationForm({
	name: "hmac",
	schema: {
		algorithm: {
			type: "select",
			label: "Algorithm",
			placeholder: "Select...",
			// SHA-1 AMD "MD5" should not be used, considered insecure TODO: DOCS THIS
			options: ["SHA-384", "SHA-256", "SHA-512"],
		},
		encoding: {
			type: "select",
			label: "Encoding",
			placeholder: "Select...",
			options: ["hex", "base64"],
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
