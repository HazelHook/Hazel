import { getLogger } from "@hazel/utils"
import { WebhookVerifier } from "../base"

import { StripeProviderProps } from "../data/provider/stripe"

import crypto from "crypto"

function extractStripeSignature(header: string) {
	const elements = header.split(",")
	let timestamp = ""
	const signatures: string[] = []

	for (const element of elements) {
		const [prefix, value] = element.split("=")
		if (prefix === "t") {
			timestamp = value
		} else if (prefix.startsWith("v")) {
			signatures.push(value)
		}
	}

	return { timestamp, signatures }
}

function constantTimeCompare(a: string, b: string): boolean {
	if (a.length !== b.length) {
		return false
	}

	let result = 0
	for (let i = 0; i < a.length; i++) {
		result |= a.charCodeAt(i) ^ b.charCodeAt(i)
	}

	return result === 0
}

export class StripeVerfier extends WebhookVerifier<StripeProviderProps> {
	verifySignature(headers: Record<string, string | null>, body: string): boolean {
		const headerKey = "stripe-signature"
		const secret = this.config.webhookSigningSecret

		const algorithm = "sha256"
		const encoding = "hex"

		const stripeHeader = headers[headerKey]

		if (!stripeHeader) {
			getLogger().debug("No Signature found for Stripe")
			return false
		}

		const { timestamp, signatures } = extractStripeSignature(stripeHeader)

		const signedPayload = `${timestamp}.${body}`

		const expectedSignature = crypto.createHmac(algorithm, secret).update(signedPayload).digest(encoding)

		for (const signature of signatures) {
			if (constantTimeCompare(signature, expectedSignature)) {
				return true
			}
		}

		return false
	}
}
