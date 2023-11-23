import crypto from "crypto"

import { WebhookVerifier } from "../verification/base"

export class Hmac extends WebhookVerifier<any> {
	verifySignature(headers: Record<string, string | null>, body: string): boolean {
		const valid = false

		return valid
	}
}
