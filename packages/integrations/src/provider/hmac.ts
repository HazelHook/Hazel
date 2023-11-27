import { getLogger } from "@hazel/utils"

import { WebhookVerifier } from "../base"
import { HmacProviderProps } from "../data/custom/hmac"
import { validateWithHmac } from "../utils"

export class HmacVerifier extends WebhookVerifier<HmacProviderProps> {
	verifySignature(headers: Record<string, string | null>, body: string): boolean {
		const headerKey = this.config.signature_header
		const secret = this.config.signature_secret

		const algorithm = this.config.algorithm
		const encoding = this.config.encoding

		const signature = headers[headerKey]

		if (!signature) {
			getLogger().debug("No Signature found for HMAC")
			return false
		}

		return validateWithHmac({ signature, algorithm, secret, body, encoding })
	}
}
