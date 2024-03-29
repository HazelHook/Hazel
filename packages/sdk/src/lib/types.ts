import { Hazel } from "../core/hazel"
import { HazelMiddleware, MiddlewareOptions } from "../core/middleware"
import { AnyHazelWebhook } from "../core/webhook-function"
import { StrictUnion } from "./helpers/types"

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
	 * The ID of this app. This is used to group functions together in the Hazel
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
	 * An array of the functions to serve and register with Hazel.
	 */
	webhooks: readonly AnyHazelWebhook[]
}

/**
 * A set of options for configuring the Hazel client.
 *
 * @public
 */
export type ClientOptions = {
	/**
	 * The ID of this instance, most commonly a reference to the application it
	 * resides in.
	 *
	 * The ID of your client should remain the same for its lifetime; if you'd
	 * like to change the name of your client as it appears in the Hazel UI,
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

	/**
	 * The Hazel environment to send events to. Defaults to whichever
	 * environment this client's event key is associated with.
	 *
	 * It's likely you never need to change this unless you're trying to sync
	 * multiple systems together using branch names.
	 */
	env?: string
}

/**
 * Given a set of client options for Hazel, return the event types that can
 * be sent or received.
 *
 * @public
 */
export type EventsFromOpts = Record<string, EventPayload>

/**
 * A user-friendly method of specifying a trigger for an Hazel function.
 *
 * @public
 */
export type WebhookOptions<T extends string> = StrictUnion<{
	event: T

	name?: string
}>

/**
 * A block representing an individual function being registered to Hazel
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
}

/**
 * Builds a context object for an Hazel handler, optionally overriding some
 * keys.
 */
export type Context<
	TOpts extends ClientOptions,
	TEvents extends Record<string, EventPayload>,
	TTrigger extends keyof TEvents & string,
	TOverrides extends Record<string, unknown> = Record<never, never>,
> = Omit<BaseContext<TOpts, TTrigger>, keyof TOverrides> & TOverrides

export type AnyContext = Context<any, any, any, any>

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

/**
 * The response to send to Hazel when pushing function config either directly
 * or when pinged by Hazel Cloud.
 *
 * @internal
 */
export interface RegisterRequest {
	/**
	 * Response version, allowing Hazel to change any top-level field.
	 */
	v: `${number}.${number}`

	/**
	 * SDK version from `package.json` for our internal metrics and to warn users
	 * they need to upgrade.
	 */
	sdk: string

	/**
	 * The name of the framework being used for this instance, e.g. "nextjs",
	 * "vercel", "netlify", "lambda", etc. Uses the `framework` specified when
	 * creating a new `HazelCommHandler`.
	 */
	framework: string

	/**
	 * The name of this particular app, used for grouping and easier viewing in
	 * the UI.
	 */
	appName: string

	/**
	 * The functions available at this particular handler.
	 */
	webhooks: WebhookConfig[]

	/**
	 * The hash of the current commit used to track deploys
	 */
	hash?: string
}

export type MiddlewareStack = [HazelMiddleware<MiddlewareOptions>, ...HazelMiddleware<MiddlewareOptions>[]]
