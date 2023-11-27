import { getLogger } from "@hazel/utils"

import { WebhookVerifier } from "./base"
import { HmacVerifier } from "./provider/hmac"
import { LinearVerifier } from "./provider/linear"
import { StripeVerfier } from "./provider/stripe"
import { SvixVerifier } from "./provider/svix"

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class WebhookVerifierFactory {
	private static verifiers: Record<string, new (config: any) => WebhookVerifier<any>> = {}

	static registerVerifier(type: string, verifierClass: new (config: any) => WebhookVerifier<any>) {
		this.verifiers[type] = verifierClass
	}

	static getVerifier(type: string, config: any): WebhookVerifier<any> | null {
		getLogger().debug(`Retrieving Verifier: ${type}`)
		const Verifier = this.verifiers[type]
		return Verifier ? new Verifier(config) : null
	}

	// New method to list all registered verifiers
	static getRegisteredVerifiers(): string[] {
		return Object.keys(this.verifiers)
	}
}

WebhookVerifierFactory.registerVerifier("hmac", HmacVerifier)

WebhookVerifierFactory.registerVerifier("svix", SvixVerifier)
WebhookVerifierFactory.registerVerifier("clerk", SvixVerifier)
WebhookVerifierFactory.registerVerifier("resend", SvixVerifier)

WebhookVerifierFactory.registerVerifier("linear", LinearVerifier)
WebhookVerifierFactory.registerVerifier("stripe", StripeVerfier)
