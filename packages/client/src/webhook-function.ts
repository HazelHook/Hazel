import { Hazel } from "./hazel"
import type {
	AnyContext,
	ClientOptions,
	EventNameFromWebhook,
	EventsFromOpts,
	Handler,
	WebhookConfig,
	WebhookOptions,
} from "./types"

export type AnyHazelWebhook = HazelWebhook<any, any, any>

/**
 * A stateless Hazel function, wrapping up function configuration and any
 * in-memory steps to run when triggered.
 *
 * This function can be "registered" to create a handler that Hazel can
 * trigger remotely.
 *
 * @public
 */
export class HazelWebhook<
	TOpts extends ClientOptions = ClientOptions,
	Events extends EventsFromOpts = EventsFromOpts,
	Opts extends WebhookOptions<EventNameFromWebhook<Events, any>> = WebhookOptions<EventNameFromWebhook<Events, any>>,
> {
	public readonly opts: Opts

	readonly #client: Hazel<TOpts>

	private readonly fn: Handler<TOpts, Events, keyof Events & string>

	/**
	 * A stateless Hazel function, wrapping up function configuration and any
	 * in-memory steps to run when triggered.
	 *
	 * This function can be "registered" to create a handler that Hazel can
	 * trigger remotely.
	 */
	constructor(
		client: Hazel<TOpts>,

		/**
		 * Options
		 */
		opts: Opts,
		fn: Handler<TOpts, Events, keyof Events & string>,
	) {
		this.#client = client
		this.opts = opts
		this.fn = fn
	}

	/**
	 * The generated or given ID for this function.
	 */
	public id(prefix?: string): string {
		return [prefix, this.opts.id].filter(Boolean).join("-")
	}

	/**
	 * The name of this function as it will appear in the Hazel Cloud UI.
	 */
	public get name(): string {
		return this.opts.name || this.id()
	}

	/**
	 * Retrieve the Hazel config for this function.
	 */
	public getConfig(
		/**
		 * Must be provided a URL that will be used to access the function and step.
		 * This function can't be expected to know how it will be accessed, so
		 * relies on an outside method providing context.
		 */
		appPrefix?: string,
	): WebhookConfig[] {
		const fnId = this.id(appPrefix)

		const fn: WebhookConfig = {
			...this.opts,
			id: fnId,
			name: this.name,
		}

		const config: WebhookConfig[] = [fn]

		return config
	}

	public execute(ctx: AnyContext) {
		return this.fn(ctx)
	}
}
