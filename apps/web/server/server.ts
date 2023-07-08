import { headers } from "next/headers"
import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client"
import SuperJSON from "superjson"

import { AppRouter } from "./routers/_app"
import { getUrl } from "./shared"

export const serverClient = createTRPCProxyClient<AppRouter>({
	transformer: SuperJSON,
	links: [
		// loggerLink({
		// 	enabled: (op) =>
		// 		process.env.NODE_ENV === "development" || (op.direction === "down" && op.result instanceof Error),
		// }),
		httpBatchLink({
			url: getUrl(),
			headers() {
				const newHeaders = new Map(headers())

				// If you're using Node 18 before 18.15.0, omit the "connection" header
				newHeaders.delete("connection")

				// `x-trpc-source` is not required, but can be useful for debugging
				newHeaders.set("x-trpc-source", "rsc")

				// Forward headers from the browser to the API
				return Object.fromEntries(newHeaders)
			},
		}),
	],
})
