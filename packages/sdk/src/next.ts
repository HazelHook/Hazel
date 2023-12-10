import { type NextApiRequest, type NextApiResponse } from "next"
import { NextRequest } from "next/server"

import { isWorkerd } from "std-env"

import { HazelCommHandler } from "./core/hazel-comm-handler"
import type { ServeHandlerOptions, SupportedFrameworks } from "./lib/types"
import { Either } from "./lib/helpers/types"
import { getResponse } from "./lib/helpers/env"

export const frameworkName: SupportedFrameworks = "nextjs"

const isNextEdgeRequest = (req: NextApiRequest | NextRequest): req is NextRequest => {
	return isWorkerd
}

/**
 * In Next.js, serve and register any declared functions with Hazel, making
 * them available to be triggered by events.
 *
 * @example Next.js <=12 or the pages router can export the handler directly
 * ```ts
 * export default serve({ client: hazel, webhooks: [wh1, wh2] });
 * ```
 *
 * @example Next.js >=13 with the `app` dir must export individual methods
 * ```ts
 * export const { GET, POST, PUT } = serve({
 *            client: hazel,
 *            webhooks: [wh1, wh2],
 * });
 * ```
 *
 * @public
 */
export const serve = (options: ServeHandlerOptions) => {
	const handler = new HazelCommHandler({
		frameworkName,
		...options,
		handler: (reqMethod: "GET" | "POST" | "PUT" | undefined, expectedReq: NextRequest, res: NextApiResponse) => {
			const req = expectedReq as Either<NextApiRequest, NextRequest>

			const isEdge = isNextEdgeRequest(req)

			const getHeader = (key: string): string | null | undefined => {
				const header = typeof req.headers.get === "function" ? req.headers.get(key) : req.headers[key]

				return Array.isArray(header) ? header[0] : header
			}

			return {
				body: () => {
					return typeof req.json === "function" ? req.json() : req.body
				},
				headers: getHeader,
				method: () => {
					/**
					 * `req.method`, though types say otherwise, is not available in Next.js
					 * 13 {@link https://beta.nextjs.org/docs/routing/route-handlers Route Handlers}.
					 *
					 * Therefore, we must try to set the method ourselves where we know it.
					 */
					return reqMethod || req.method || ""
				},
				isProduction: () => {
					/**
					 * Vercel Edge Functions do not allow dynamic access to environment
					 * variables, so we'll manage production checks directly here.
					 *
					 * We try/catch to avoid situations where Next.js is being used in
					 * environments where `process.env` is not accessible or polyfilled.
					 */
					try {
						return process.env.NODE_ENV === "production"
					} catch (err) {
						// no-op
					}
				},
				queryString: (key, url) => {
					const qs = req.query?.[key] || url.searchParams.get(key)
					return Array.isArray(qs) ? qs[0] : qs
				},

				url: () => {
					if (isEdge) {
						return new URL(req.url)
					}

					return new URL(req.url as string)
				},
				transformResponse: ({ body, headers, status }) => {
					/**
					 * Carefully attempt to set headers and data on the response object
					 * for Next.js 12 support.
					 */
					if (typeof res?.setHeader === "function") {
						for (const [key, value] of Object.entries(headers)) {
							res.setHeader(key, value)
						}
					}

					if (typeof res?.status === "function" && typeof res?.send === "function") {
						res.status(status).send(body)
					}

					/**
					 * Next.js 13 requires that the return value is always `Response`,
					 * though this serve handler can't understand if we're using 12 or 13.
					 *
					 * 12 doesn't seem to care if we also return a response from the
					 * handler, so we'll just return `undefined` here, which will be safe
					 * at runtime and enforce types for use with Next.js 13.
					 *
					 * We also don't know if the current environment has a native
					 * `Response` object, so we'll grab that first.
					 */
					const Res = getResponse()
					return new Res(body, { status, headers })
				},
				transformStreamingResponse: ({ body, headers, status }) => {
					return new Response(body, { status, headers })
				},
			}
		},
	})

	/**
	 * Next.js 13 uses
	 * {@link https://beta.nextjs.org/docs/routing/route-handlers Route Handlers}
	 * to declare API routes instead of a generic catch-all method that was
	 * available using the `pages/api` directory.
	 *
	 * This means that users must now export a function for each method supported
	 * by the endpoint. For us, this means requiring a user explicitly exports
	 * `GET`, `POST`, and `PUT` functions.
	 *
	 * Because of this, we'll add circular references to those property names of
	 * the returned handler, meaning we can write some succinct code to export
	 * them. Thanks, @goodoldneon.
	 *
	 * @example
	 * ```ts
	 * export const { GET, POST, PUT } = serve(...);
	 * ```
	 *
	 * See {@link https://beta.nextjs.org/docs/routing/route-handlers}
	 */
	const baseFn = handler.createHandler()

	const fn = baseFn.bind(null, undefined)
	type Fn = typeof fn

	const handlerFn = Object.defineProperties(fn, {
		GET: { value: baseFn.bind(null, "GET") },
		POST: { value: baseFn.bind(null, "POST") },
		PUT: { value: baseFn.bind(null, "PUT") },
	}) as Fn & {
		GET: Fn
		POST: Fn
		PUT: Fn
	}

	return handlerFn
}
