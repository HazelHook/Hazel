import { Hazel } from "./hazel"
import type {
	ClientOptions,
	EventNameFromWebhook,
	EventsFromOpts,
	Handler,
	WebhookOptions,
	WebhookTrigger,
} from "./types"

export type AnyHazelWebhook = HazelWebhook<any, any, any>

/**
 * A stateless Hazel function, wrapping up function configuration and any
 * in-memory steps to run when triggered.
 *
 * This function can be "registered" to create a handler that Inngest can
 * trigger remotely.
 *
 * @public
 */
export class HazelWebhook<
	TOpts extends ClientOptions = ClientOptions,
	Events extends EventsFromOpts = EventsFromOpts,
	Trigger extends WebhookTrigger<keyof Events & string> = WebhookTrigger<keyof Events & string>,
	Opts extends WebhookOptions<EventNameFromWebhook<Events, Trigger>> = WebhookOptions<
		EventNameFromWebhook<Events, Trigger>
	>,
> {
	static stepId = "step"
	static failureSuffix = "-failure"

	public readonly opts: Opts
	public readonly trigger: Trigger

	readonly #client: Hazel<TOpts>

	private readonly fn: Handler<TOpts, Events, keyof Events & string>

	/**
	 * A stateless Inngest function, wrapping up function configuration and any
	 * in-memory steps to run when triggered.
	 *
	 * This function can be "registered" to create a handler that Inngest can
	 * trigger remotely.
	 */
	constructor(
		client: Hazel<TOpts>,

		/**
		 * Options
		 */
		opts: Opts,
		trigger: Trigger,
		fn: Handler<TOpts, Events, keyof Events & string>,
	) {
		this.#client = client
		this.opts = opts
		this.trigger = trigger
		this.fn = fn
	}

	/**
	 * The generated or given ID for this function.
	 */
	public id(prefix?: string): string {
		return [prefix, this.opts.id].filter(Boolean).join("-")
	}

	/**
	 * The name of this function as it will appear in the Inngest Cloud UI.
	 */
	public get name(): string {
		return this.opts.name || this.id()
	}
}
