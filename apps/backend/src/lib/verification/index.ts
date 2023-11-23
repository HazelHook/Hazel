import { WebhookVerifier } from "./base"
import { SvixVerifier } from "./provider/svix"

export function RegisterWebhookVerifier(type: string) {
	return function <T extends { new (...args: any[]): WebhookVerifier }>(classValues: T) {
		WebhookVerifierFactory.registerVerifier(type, classValues)
	}
}

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class WebhookVerifierFactory {
	private static verifiers: Record<string, new (config: any) => WebhookVerifier> = {}

	static registerVerifier(type: string, verifierClass: new (config: any) => WebhookVerifier) {
		this.verifiers[type] = verifierClass
	}

	static getVerifier(type: string, config: any): WebhookVerifier | null {
		const Verifier = this.verifiers[type]
		return Verifier ? new Verifier(config) : null
	}

	// New method to list all registered verifiers
	static getRegisteredVerifiers(): string[] {
		return Object.keys(this.verifiers)
	}
}

WebhookVerifierFactory.registerVerifier("svix", SvixVerifier)
