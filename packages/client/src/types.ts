import { Hazel } from "./hazel"
import { StrictUnion } from "./lib/helpers/types"
import { AnyHazelWebhook } from "./webhook-function"

export type SupportedFrameworks =
	// | "cloudflare-pages"
	// | "digitalocean"
	// | "edge"
	// | "express"
	// | "aws-lambda"
	"nextjs"
// | "nuxt"
// | "h3"
// | "redwoodjs"
// | "remix"
// | "deno/fresh"
// | "fastify"

export interface EventPayload {
	/**
	 * A unique identifier for the event
	 */
	name: string

	/**
	 * Any data pertinent to the event
	 */
	data?: any

	/**
	 * Any user data associated with the event
	 * All fields ending in "_id" will be used to attribute the event to a particular user
	 */
	user?: any

	/**
	 * A specific event schema version
	 * (optional)
	 */
	v?: string

	/**
	 * An integer representing the milliseconds since the unix epoch at which this
	 * event occurred.
	 *
	 * Defaults to the current time.
	 * (optional)
	 */
	ts?: number
}

export interface RegisterOptions {
	secret: string

	/**
	 * If provided, will override the used `fetch` implementation. Useful for
	 * giving the library a particular implementation if accessing it is not done
	 * via globals.
	 *
	 * By default the library will try to use the native Web API fetch, falling
	 * back to a Node implementation if no global fetch can be found.
	 */
	fetch?: typeof fetch

	/**
	 * The ID of this app. This is used to group functions together in the Inngest
	 * UI. The ID of the passed client is used by default.
	 */
	id?: string
}

export interface ServeHandlerOptions extends RegisterOptions {
	/**
	 * The `Hazel` instance used to declare all functions.
	 */
	client: Hazel<any>

	/**
	 * An array of the functions to serve and register with Inngest.
	 */
	webhooks: readonly AnyHazelWebhook[]
}

/**
 * A set of options for configuring the Inngest client.
 *
 * @public
 */
export type ClientOptions = {
	/**
	 * The ID of this instance, most commonly a reference to the application it
	 * resides in.
	 *
	 * The ID of your client should remain the same for its lifetime; if you'd
	 * like to change the name of your client as it appears in the Inngest UI,
	 * change the `name` property instead.
	 */
	id: string

	/**
	 * If provided, will override the used `fetch` implementation. Useful for
	 * giving the library a particular implementation if accessing it is not done
	 * via globals.
	 *
	 * By default the library will try to use the native Web API fetch, falling
	 * back to a Node implementation if no global fetch can be found.
	 */
	fetch?: typeof fetch
}

/**
 * Given a set of client options for Inngest, return the event types that can
 * be sent or received.
 *
 * @public
 */
export type EventsFromOpts = Record<string, EventPayload>

/**
 * A user-friendly method of specifying a trigger for an Inngest function.
 *
 * @public
 */
export type WebhookOptions<T extends string> = StrictUnion<{
	event: T

	id: string

	name?: string
}>

/**
 * A block representing an individual function being registered to Inngest
 * Cloud.
 *
 * @internal
 */
export interface WebhookConfig {
	name?: string
	id: string
}

/**
 * Given a set of events and a user-friendly trigger paramter, returns the name
 * of the event that the user intends to listen to.
 *
 * @public
 */
export type EventNameFromWebhook<
	Events extends Record<string, EventPayload>,
	T extends WebhookOptions<keyof Events & string>,
> = T extends string ? T : T extends { event: string } ? T["event"] : string

export type BaseContext<TOpts extends ClientOptions, TTrigger extends keyof EventsFromOpts & string> = {
	/**
	 * The event data present in the payload.
	 */
	event: EventsFromOpts[TTrigger]

	events: [EventsFromOpts[TTrigger], ...EventsFromOpts[TTrigger][]]
}

/**
 * Builds a context object for an Inngest handler, optionally overriding some
 * keys.
 */
export type Context<
	TOpts extends ClientOptions,
	TEvents extends Record<string, EventPayload>,
	TTrigger extends keyof TEvents & string,
	TOverrides extends Record<string, unknown> = Record<never, never>,
> = Omit<BaseContext<TOpts, TTrigger>, keyof TOverrides> & TOverrides

/**
 * The shape of a Hazel function, taking in event, step, ctx, and step
 * tooling.
 *
 * @public
 */
export type Handler<
	TOpts extends ClientOptions,
	TEvents extends EventsFromOpts,
	TTrigger extends keyof TEvents & string,
	TOverrides extends Record<string, unknown> = Record<never, never>,
> = (
	/**
	 * The context argument provides access to all data and tooling available to
	 * the function.
	 */
	ctx: Context<TOpts, TEvents, TTrigger, TOverrides>,
) => unknown
