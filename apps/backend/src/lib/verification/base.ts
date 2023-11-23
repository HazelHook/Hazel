export abstract class WebhookVerifier {
	constructor(protected config: any) {}

	// Abstract method for signature verification
	abstract verifySignature(headers: Record<string, string | null>, body: string): boolean
}
