import crypto from "crypto"
import { WebhookVerifier } from "../base"
import { SvixProviderProps } from "../data/provider/svix"

export const extractSvixSignatures = (header: string) => {
	// Regular expression to match each signature with its version
	const regex = /v\d+,([^ ]+)/g

	// Extract signatures
	const signatures = []
	let match = regex.exec(header) // Initial assignment
	while (match !== null) {
		signatures.push(match[1])
		match = regex.exec(header) // Re-assign in each iteration
	}

	return signatures
}

export class SvixVerifier extends WebhookVerifier<SvixProviderProps> {
	verifySignature(headers: Record<string, string | null>, body: string): boolean {
		const sigHeader = headers["svix-signature"]!
		const svixTimestamp = headers["svix-timestamp"]
		const svixId = headers["svix-id"]

		const signatures = extractSvixSignatures(sigHeader)

		const secretBytes = Buffer.from(this.config.webhookSigningSecret.split("_")[1], "base64")

		const signedContent = `${svixId}.${svixTimestamp}.${body}`

		const newSignature = crypto.createHmac("sha256", secretBytes).update(signedContent).digest("base64")

		let valid = false

		for (let i = 0; i < signatures.length; i++) {
			if (signatures[i] === newSignature) {
				valid = true
				break
			}
		}

		return valid
	}
}
