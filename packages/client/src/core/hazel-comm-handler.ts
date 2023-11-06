import { Hazel } from "./hazel"
import { Env, allProcessEnv, hazelHeaders } from "../lib/helpers/env"
import { rethrowError, serializeError } from "../lib/helpers/errors"
import { runAsPromise } from "../lib/helpers/promises"
import { IntrospectRequest, MaybePromise } from "../lib/helpers/types"
import { RegisterOptions, RegisterRequest, SupportedFrameworks, WebhookConfig } from "../lib/types"
import { AnyHazelWebhook, HazelWebhook } from "./webhook-function"

import { safeStringify } from "../lib/helpers/safe-stringify"
import { awaitSync } from "../lib/helpers/sync"

/**
 * The broad definition of a handler passed when instantiating an
 * {@link HazelCommHandler} instance.
 */
export type Handler<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Input extends any[] = any[],
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Output = any,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	StreamOutput = any,
> = (...args: Input) => HandlerResponse<Output, StreamOutput>

interface HazelCommHandlerOptions<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Input extends any[] = any[],
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Output = any,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	StreamOutput = any,
> extends RegisterOptions {
	/**
	 * The name of the framework this handler is designed for. Should be
	 * lowercase, alphanumeric characters inclusive of `-` and `/`.
	 *
	 * This should never be defined by the user; a {@link ServeHandler} should
	 * abstract this.
	 */
	frameworkName: SupportedFrameworks

	/**
	 * The name of this serve handler, e.g. `"My App"`. It's recommended that this
	 * value represents the overarching app/service that this set of functions is
	 * being served from.
	 *
	 * This can also be an `Hazel` client, in which case the name given when
	 * instantiating the client is used. This is useful if you're sending and
	 * receiving events from the same service, as you can reuse a single
	 * definition of Hazel.
	 */
	client: Hazel<any>

	/**
	 * An array of the functions to serve and register with Hazel.
	 */
	webhooks: readonly AnyHazelWebhook[]

	/**
	 * The `handler` is the function your framework requires to handle a
	 * request. For example, this is most commonly a function that is given a
	 * `Request` and must return a `Response`.
	 *
	 * The handler must map out any incoming parameters, then return a
	 * strictly-typed object to assess what kind of request is being made,
	 * collecting any relevant data as we go.
	 *
	 * @example
	 * ```
	 * return {
	 *   register: () => { ... },
	 *   run: () => { ... },
	 *   view: () => { ... }
	 * };
	 * ```
	 *
	 * Every key must be specified and must be a function that either returns
	 * a strictly-typed payload or `undefined` if the request is not for that
	 * purpose.
	 *
	 * This gives handlers freedom to choose how their platform of choice will
	 * trigger differing actions, whilst also ensuring all required information
	 * is given for each request type.
	 *
	 * See any existing handler for a full example.
	 *
	 * This should never be defined by the user; a {@link ServeHandler} should
	 * abstract this.
	 */
	handler: Handler<Input, Output, StreamOutput>
}

export type HandlerResponse<Output = any, StreamOutput = any> = {
	body: () => MaybePromise<any>
	env?: () => MaybePromise<Env>
	headers: (key: string) => MaybePromise<string | null | undefined>

	/**
	 * Whether the current environment is production. This is used to determine
	 * some functionality like whether to connect to the dev server or whether to
	 * show debug logging.
	 *
	 * If this is not provided--or is provided and returns `undefined`--we'll try
	 * to automatically detect whether we're in production by checking various
	 * environment variables.
	 */
	isProduction?: () => MaybePromise<boolean | undefined>
	method: () => MaybePromise<string>
	queryString?: (key: string, url: URL) => MaybePromise<string | null | undefined>
	url: () => MaybePromise<URL>

	/**
	 * The `transformResponse` function receives the output of the Hazel SDK and
	 * can decide how to package up that information to appropriately return the
	 * information to Hazel.
	 *
	 * Mostly, this is taking the given parameters and returning a new `Response`.
	 *
	 * The function is passed an {@link ActionResponse}, an object containing a
	 * `status` code, a `headers` object, and a stringified `body`. This ensures
	 * you can appropriately handle the response, including use of any required
	 * parameters such as `res` in Express-/Connect-like frameworks.
	 */
	transformResponse: (res: ActionResponse<string>) => Output

	/**
	 * The `transformStreamingResponse` function, if defined, declares that this
	 * handler supports streaming responses back to Hazel. This is useful for
	 * functions that are expected to take a long time, as edge streaming can
	 * often circumvent restrictive request timeouts and other limitations.
	 *
	 * If your handler does not support streaming, do not define this function.
	 *
	 * It receives the output of the Hazel SDK and can decide how to package
	 * up that information to appropriately return the information in a stream
	 * to Hazel.
	 *
	 * Mostly, this is taking the given parameters and returning a new `Response`.
	 *
	 * The function is passed an {@link ActionResponse}, an object containing a
	 * `status` code, a `headers` object, and `body`, a `ReadableStream`. This
	 * ensures you can appropriately handle the response, including use of any
	 * required parameters such as `res` in Express-/Connect-like frameworks.
	 */
	transformStreamingResponse?: (res: ActionResponse<ReadableStream>) => StreamOutput
}

/**
 * The response from the Hazel SDK before it is transformed in to a
 * framework-compatible response by an {@link HazelCommHandler} instance.
 */
export interface ActionResponse<TBody extends string | ReadableStream = string> {
	/**
	 * The HTTP status code to return.
	 */
	status: number

	/**
	 * The headers to return in the response.
	 */
	headers: Record<string, string>

	/**
	 * A stringified body to return.
	 */
	body: TBody
}

export class HazelCommHandler<Input extends any[] = any[], Output = any, StreamOutput = any> {
	/**
	 * The ID of this serve handler, e.g. `"my-app"`. It's recommended that this
	 * value represents the overarching app/service that this set of functions is
	 * being served from.
	 */
	public readonly id: string

	/**
	 * The handler specified during instantiation of the class.
	 */
	public readonly handler: Handler

	/**
	 * The name of the framework this handler is designed for. Should be
	 * lowercase, alphanumeric characters inclusive of `-` and `/`.
	 */
	protected readonly frameworkName: string

	/**
	 * The signing key used to validate requests from Hazel. This is
	 * intentionally mutatble so that we can pick up the signing key from the
	 * environment during execution if needed.
	 */
	protected readonly secret: string

	/**
	 * A property that can be set to indicate whether or not we believe we are in
	 * production mode.
	 *
	 * Should be set every time a request is received.
	 */
	protected _isProd = false

	private readonly client: Hazel<any>

	/**
	 * A private collection of just Hazel functions, as they have been passed
	 * when instantiating the class.
	 */
	private readonly rawFns: AnyHazelWebhook[]

	private env: Env = allProcessEnv()

	/**
	 * A private collection of functions that are being served. This map is used
	 * to find and register functions when interacting with Hazel Cloud.
	 */
	private readonly fns: Record<string, { fn: HazelWebhook; onFailure: boolean }> = {}

	constructor(options: HazelCommHandlerOptions<Input, Output, StreamOutput>) {
		this.frameworkName = options.frameworkName
		this.client = options.client
		this.id = options.id || this.client.id

		this.handler = options.handler as Handler

		// Ensure we filter any undefined functions in case of missing imports.
		this.rawFns = options.webhooks.filter(Boolean)

		if (this.rawFns.length !== options.webhooks.length) {
			console.warn(
				"Some functions passed to serve() are undefined and misconfigured.  Please check your imports.",
			)
		}

		this.fns = this.rawFns.reduce<Record<string, { fn: HazelWebhook; onFailure: boolean }>>((acc, fn) => {
			const configs = fn.getConfig(this.id)

			const fns = configs.reduce((acc, { id }, index) => {
				// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
				return { ...acc, [id]: { fn, onFailure: Boolean(index) } }
			}, {})

			// biome-ignore lint/complexity/noForEach: <explanation>
			configs.forEach(({ id }) => {
				if (acc[id]) {
					// TODO PrettyError
					throw new Error(
						`Duplicate function ID "${id}"; please change a function's name or provide an explicit ID to avoid conflicts.`,
					)
				}
			})

			return {
				// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
				...acc,
				...fns,
			}
		}, {})

		this.secret = options.secret
	}

	public createHandler(): (...args: Input) => Promise<Output> {
		return async (...args: Input) => {
			/**
			 * We purposefully `await` the handler, as it could be either sync or
			 * async.
			 */
			const rawActions = await awaitSync(() => this.handler(...args)).catch(
				rethrowError("Serve handler failed to run"),
			)

			/**
			 * Map over every `action` in `rawActions` and create a new `actions`
			 * object where each function is safely promisifed with each access
			 * requiring a reason.
			 *
			 * This helps us provide high quality errors about what's going wrong for
			 * each access without having to wrap every access in a try/catch.
			 */
			const actions: HandlerResponseWithErrors = Object.entries(rawActions).reduce((acc, [key, value]) => {
				if (typeof value !== "function") {
					return acc
				}

				return {
					// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
					...acc,
					[key]: (reason: string, ...args: unknown[]) => {
						const errMessage = [`Failed calling \`${key}\` from serve handler`, reason]
							.filter(Boolean)
							.join(" when ")

						const fn = () => (value as (...args: unknown[]) => unknown)(...args)

						return runAsPromise(fn)
							.catch(rethrowError(errMessage))
							.catch((err) => {
								// TODO: ADD LOGGER
								// this.log("error", err)
								throw err
							})
					},
				}
			}, {} as HandlerResponseWithErrors)

			this.env = (await actions.env?.("starting to handle request")) ?? allProcessEnv()

			const actionRes = this.handleAction(actions)

			/**
			 * Prepares an action response by merging returned data to provide
			 * trailing information such as `Server-Timing` headers.
			 *
			 * It should always prioritize the headers returned by the action, as
			 * they may contain important information such as `Content-Type`.
			 *
			 */
			const prepareActionRes = (res: ActionResponse): ActionResponse => {
				return {
					...res,
					headers: {
						...hazelHeaders(),
						...res.headers,
					},
				}
			}

			return actionRes.then(prepareActionRes).then((actionRes) => {
				return actions.transformResponse("sending back response", actionRes)
			})
		}
	}

	private async handleAction(actions: HandlerResponseWithErrors) {
		try {
			const method = await actions.method("starting to handle request")

			const hazelKey = await actions.headers("getting headers", "X-HAZEL_KEY")

			const hazelSignature = await actions.headers("getting headers", "X-HAZEL_SIGNATURE")

			const url = await actions.url("getting url")

			const hazel_overview_mode = url.searchParams.get("hazel_overview")

			if (hazel_overview_mode === "true") {
				const registerBody = this.registerBody()

				return {
					status: 200,
					body: safeStringify(registerBody),
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Methods": "GET, POST",
						"Access-Control-Allow-Headers": "Content-Type, Authorization",
						...hazelHeaders(),
					},
				}
			}

			if (!hazelKey) {
				throw new Error("No webhook ID found in request")
			}

			const fn = this.fns[hazelKey]

			console.log(fn, method)

			if (!fn) {
				throw new Error(`Could not find webhook handler with Key "${hazelKey}"`)
			}

			const body = await actions.body("getting body")

			const res = await fn.fn.execute({ data: body })

			if (method === "GET") {
				const registerBody = this.registerBody()

				const introspection: IntrospectRequest = {
					message: "Hazel endpoint configured correctly.",
					hasProjectKey: Boolean(this.client.id),
					hasSecretKey: Boolean(this.secret),
					webhookHandlerFound: registerBody.webhooks.length,
				}

				return {
					status: 200,
					body: safeStringify(introspection),
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
						"Access-Control-Allow-Headers": "Content-Type, Authorization",
						...hazelHeaders(),
					},
				}
			}

			if (method === "POST") {
				return {
					status: 201,
					body: safeStringify(res),
					headers: hazelHeaders(),
				}
			}
		} catch (error) {
			return {
				status: 500,
				body: safeStringify({
					type: "internal",
					...serializeError(error as Error),
				}),
				headers: hazelHeaders(),
			}
		}

		return {
			status: 405,
			body: JSON.stringify({
				message: "No action found; request was likely not POST, PUT, or GET",
				isProd: this._isProd,
			}),
			headers: hazelHeaders(),
		}
	}

	protected registerBody(): RegisterRequest {
		const body: RegisterRequest = {
			framework: this.frameworkName,
			appName: this.id,
			webhooks: this.configs(),
			sdk: `js:${this.client.version}`,
			v: "0.1",
		}

		return body
	}

	protected configs(): WebhookConfig[] {
		return Object.values(this.rawFns).reduce<WebhookConfig[]>(
			// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
			(acc, fn) => [...acc, ...fn.getConfig(this.id)],
			[],
		)
	}
}

/**
 * A version of {@link HandlerResponse} where each function is safely
 * promisified and requires a reason for each access.
 *
 * This enables us to provide accurate errors for each access without having to
 * wrap every access in a try/catch.
 */
type HandlerResponseWithErrors = {
	[K in keyof HandlerResponse]: NonNullable<HandlerResponse[K]> extends (...args: infer Args) => infer R
		? R extends MaybePromise<infer PR>
			? (errMessage: string, ...args: Args) => Promise<PR>
			: (errMessage: string, ...args: Args) => Promise<R>
		: HandlerResponse[K]
}
