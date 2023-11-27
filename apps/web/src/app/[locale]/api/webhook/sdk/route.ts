import { Hazel } from "@hazel/client"
import { serve } from "@hazel/client/next"

const hazel = new Hazel({ id: "test" })

const stripe = hazel.createWebhook({ event: "stripe", id: "stripe" }, async (opts) => {
	console.log("opts")
	return { body: "Hello, World!" }
})

const svix = hazel.createWebhook({ event: "svix", id: "svix" }, async (opts) => {
	console.log(opts)
	return { body: "Hello, World!" }
})

const linear = hazel.createWebhook({ event: "linear", id: "linear" }, async (opts) => {
	console.log(opts.event.data, "XD")
	return { body: "Hello, World!" }
})

export const { GET, POST, PUT } = serve({
	client: hazel,
	secret: "",
	webhooks: [svix, stripe, linear],
})

// export const runtime = "edge"
