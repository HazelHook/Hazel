import { z } from "zod"
import { Hazel } from "./hazel"
import { Env, allProcessEnv } from "./lib/helpers/env"
import { rethrowError } from "./lib/helpers/errors"
import { runAsPromise } from "./lib/helpers/promises"
import { ServerTiming } from "./lib/helpers/server-timing"
import { MaybePromise } from "./lib/helpers/types"
import { RegisterOptions, SupportedFrameworks } from "./types"
import { AnyHazelWebhook, HazelWebhook } from "./webhook-function"

import pkg from "../package.json"

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

	version: number
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

	protected readonly version = pkg.version

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

	public createHandler(): (...args: Input) => Promise<Awaited<Output>> {
		return async (...args: Input) => {
			const timer = new ServerTiming()

			/**
			 * We purposefully `await` the handler, as it could be either sync or
			 * async.
			 */
			const rawActions = await timer
				.wrap("handler", () => this.handler(...args))
				.catch(rethrowError("Serve handler failed to run"))

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

			const getInngestHeaders = (): Record<string, string> =>
				inngestHeaders({
					env: this.env,
					framework: this.frameworkName,
					client: this.client,
					extras: {
						"Server-Timing": timer.getHeader(),
					},
				})

			const actionRes = timer.wrap("action", () => this.handleAction(actions, timer, getInngestHeaders))

			/**
			 * Prepares an action response by merging returned data to provide
			 * trailing information such as `Server-Timing` headers.
			 *
			 * It should always prioritize the headers returned by the action, as
			 * they may contain important information such as `Content-Type`.
			 */
			const prepareActionRes = (res: ActionResponse): ActionResponse => ({
				...res,
				headers: {
					...getInngestHeaders(),
					...res.headers,
				},
			})

			return timer.wrap("res", async () => {
				return actionRes.then(prepareActionRes).then((actionRes) => {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return actions.transformResponse("sending back response", actionRes)
				})
			})
		}
	}

	/**
	 * Given a set of functions to check if an action is available from the
	 * instance's handler, enact any action that is found.
	 *
	 * This method can fetch varying payloads of data, but ultimately is the place
	 * where _decisions_ are made regarding functionality.
	 *
	 * For example, if we find that we should be viewing the UI, this function
	 * will decide whether the UI should be visible based on the payload it has
	 * found (e.g. env vars, options, etc).
	 */
	private async handleAction(actions: HandlerResponseWithErrors, timer: ServerTiming): Promise<ActionResponse> {
		this._isProd = (await actions.isProduction?.("starting to handle request")) ?? isProd(this.env)

		this.upsertKeysFromEnv()

		try {
			const url = await actions.url("starting to handle request")
			const method = await actions.method("starting to handle request")

			const getQuerystring = async (reason: string, key: string): Promise<string | undefined> => {
				const ret = (await actions.queryString?.(reason, key, url)) || url.searchParams.get(key) || undefined

				return ret
			}

			if (method === "POST") {
				const signature = await actions.headers("checking signature for run request", headerKeys.Signature)

				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const body = await actions.body("processing run request")
				this.validateSignature(signature ?? undefined, body)

				const fnId = await getQuerystring("processing run request", queryKeys.FnId)
				if (!fnId) {
					// TODO PrettyError
					throw new Error("No function ID found in request")
				}

				const { result } = this.runStep(fnId, stepId, body, timer)
				const stepOutput = await result

				const resultHandlers: ExecutionResultHandlers<ActionResponse> = {
					"function-rejected": (result) => {
						return {
							status: result.retriable ? 500 : 400,
							headers: {
								"Content-Type": "application/json",
								[headerKeys.NoRetry]: result.retriable ? "false" : "true",
								...(typeof result.retriable === "string"
									? { [headerKeys.RetryAfter]: result.retriable }
									: {}),
							},
							body: stringify(undefinedToNull(result.error)),
							version: this.version,
						}
					},
					"function-resolved": (result) => {
						return {
							status: 200,
							headers: {
								"Content-Type": "application/json",
							},
							body: stringify(undefinedToNull(result.data)),
							version,
						}
					},
				}

				const handler = resultHandlers[stepOutput.type] as ExecutionResultHandler<ActionResponse>

				try {
					return await handler(stepOutput)
				} catch (err) {
					console.error("error", "Error handling execution result", err)
					throw err
				}
			}

			if (method === "GET") {
				const registerBody = this.registerBody(this.reqUrl(url))

				const introspection: IntrospectRequest = {
					message: "Inngest endpoint configured correctly.",
					hasEventKey: Boolean(this.client["eventKey"]),
					hasSigningKey: Boolean(this.signingKey),
					functionsFound: registerBody.functions.length,
				}

				return {
					status: 200,
					body: stringify(introspection),
					headers: {
						"Content-Type": "application/json",
					},
					version,
				}
			}

			if (method === "PUT") {
				const deployId = await getQuerystring("processing deployment request", queryKeys.DeployId)

				const { status, message, modified } = await this.register(this.reqUrl(url), deployId, getInngestHeaders)

				return {
					status,
					body: stringify({ message, modified }),
					headers: {
						"Content-Type": "application/json",
					},
					version: undefined,
				}
			}
		} catch (err) {
			return {
				status: 500,
				body: stringify({
					type: "internal",
					...serializeError(err as Error),
				}),
				headers: {
					"Content-Type": "application/json",
				},
				version: undefined,
			}
		}

		return {
			status: 405,
			body: JSON.stringify({
				message: "No action found; request was likely not POST, PUT, or GET",
				isProd: this._isProd,
				skipDevServer: this._skipDevServer,
			}),
			headers: {},
			version: undefined,
		}
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
