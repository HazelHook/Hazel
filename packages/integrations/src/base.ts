export abstract class WebhookVerifier<T> {
	constructor(protected config: T) {}

	// Abstract method for signature verification
	abstract verifySignature(headers: Record<string, string | null>, body: string): boolean
}
