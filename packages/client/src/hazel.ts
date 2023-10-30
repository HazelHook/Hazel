import type { ClientOptions, EventsFromOpts, WebhookOptions, EventNameFromWebhook, Handler } from "./types"
import { HazelWebhook } from "./webhook-function"

export class Hazel<TOpts extends ClientOptions = ClientOptions> {
	public readonly id: string

	constructor({ id }: TOpts) {
		if (!id) {
			throw new Error("An `id` must be passed to create an Hazel instance.")
		}

		this.id = id
	}

	public createWebhook<
		TWebhook extends WebhookOptions<keyof EventsFromOpts>,
		TTriggerName extends keyof EventsFromOpts & string = EventNameFromWebhook<EventsFromOpts, TWebhook>,
	>(options: TWebhook, handler: Handler<TOpts, EventsFromOpts, TTriggerName>) {
		return new HazelWebhook(this, {}, options, handler)
	}
}
