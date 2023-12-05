import pkg from "../../package.json"
import { hazelHeaders } from "../lib/helpers/env"
import type { ClientOptions, EventNameFromWebhook, EventsFromOpts, Handler, WebhookOptions } from "../lib/types"
import { HazelWebhook } from "./webhook-function"

export class Hazel<TOpts extends ClientOptions = ClientOptions> {
	public readonly id: string

	public readonly version = pkg.version

	public readonly headers: Record<string, string>

	// private readonly middleware: Promise<MiddlewareRegisterReturn[]>

	constructor({ id, env }: TOpts) {
		if (!id) {
			throw new Error("An `id` must be passed to create an Hazel instance.")
		}

		this.id = id

		this.headers = hazelHeaders({
			hazelEnv: env,
		})
	}

	public createWebhook<
		TWebhookOpt extends WebhookOptions<keyof EventsFromOpts>,
		TTriggerName extends keyof EventsFromOpts & string = EventNameFromWebhook<EventsFromOpts, TWebhookOpt>,
	>(options: TWebhookOpt, handler: Handler<TOpts, EventsFromOpts, TTriggerName>) {
		return new HazelWebhook(this, options, handler)
	}
}
