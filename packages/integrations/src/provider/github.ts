import { getLogger } from "@hazel/utils"

import { WebhookVerifier } from "../base"
import { GithubProviderProps } from "../data/provider/github"
import { validateWithHmac } from "../utils"

// TODO: INCOMPLETE
export class GithubVerifier extends WebhookVerifier<GithubProviderProps> {
	verifySignature(headers: Record<string, string | null>, body: string): boolean {
		const headerKey = "X-Hub-Signature-256"
		const secret = this.config.webhookSigningSecret

		const algorithm = "sha256"
		const encoding = "hex"

		const signature = headers[headerKey]

		if (!signature) {
			getLogger().debug("No Signature found for Github")
			return false
		}

		return validateWithHmac({ signature, secret, encoding, algorithm, body })
	}
}
