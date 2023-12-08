import { Hazel } from "@hazel/sdk"
import { serve } from "@hazel/sdk/next"

const hazel = new Hazel({ id: "test" })

const stripe = hazel.createWebhook({ event: "stripe" }, async (opts) => {
	console.log("opts")
	return { body: "Hello, World!" }
})

const svix = hazel.createWebhook({ event: "svix" }, async (opts) => {
	console.log(opts)
	return { body: "Hello, World!" }
})

const linear = hazel.createWebhook({ event: "linear" }, async (opts) => {
	console.log(JSON.stringify(opts.event), "WOWZIEZ")
	return opts
})

export const { GET, PUT, POST } = serve({
	client: hazel,
	secret: "",
	webhooks: [svix, stripe, linear],
})

export const runtime = "edge"
