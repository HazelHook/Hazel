import { z } from "zod"

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
			label: "Algorithm",
			// SHA-1 AMD "MD5" should not be used, considered insecure TODO: DOCS THIS
			validator: z.enum(["SHA-384", "SHA-256", "SHA-512"]),
			placeholder: "Select...",
		},
		encoding: {
			label: "Encoding",
			validator: z.enum(["hex", "base64"]),
			placeholder: "Select...",
		},
		signature_header: {
			validator: z.string(),
			label: "Signature Header Key",
			placeholder: "Enter the header key...",
			description: "The header key that contains the signature. This is usually `X-API-Signature`.",
		},
		signature_secret: {
			validator: z.string(),
			label: "Signature Secret",
			placeholder: "Enter the secret...",
			description: "The secret used to sign the webhook payload.",
		},
	},
})
