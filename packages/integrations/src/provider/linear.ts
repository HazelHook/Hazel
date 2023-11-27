import { getLogger } from "@hazel/utils"

import { WebhookVerifier } from "../base"
import { LinearProviderProps } from "../data/provider/linear"
import { validateWithHmac } from "../utils"

export class LinearVerifier extends WebhookVerifier<LinearProviderProps> {
	verifySignature(headers: Record<string, string | null>, body: string): boolean {
		const headerKey = "linear-signature"
		const secret = this.config.webhookSigningSecret

		const algorithm = "sha256"
		const encoding = "hex"

		const signature = headers[headerKey]

		if (!signature) {
			getLogger().debug("No Signature found for HMAC")
			return false
		}

		return validateWithHmac({ signature, secret, encoding, algorithm, body })
	}
}
