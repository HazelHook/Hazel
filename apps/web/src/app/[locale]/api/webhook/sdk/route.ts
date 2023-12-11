import { Hazel } from "@hazelapp/sdk"
import { serve } from "@hazelapp/sdk/next"

const hazel = new Hazel({ id: "test" })

const stripe = hazel.createWebhook({ event: "stripe" }, async (opts) => {
	return { body: "Hello, World!" }
})

const svix = hazel.createWebhook({ event: "svix" }, async (opts) => {
	return { body: "Hello, World!" }
})

const linear = hazel.createWebhook({ event: "linear" }, async (opts) => {
	return opts.event
})

export const { GET, PUT, POST } = serve({
	client: hazel,
	secret: "sk_530a7f6d609053a3d750107cc9f",
	webhooks: [svix, stripe, linear],
})

export const runtime = "edge"
