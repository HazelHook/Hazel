import { serve } from "@hazel/client/next"
import { Hazel } from "@hazel/client"

const hazel = new Hazel({ id: "test" })

const test = hazel.createWebhook({ event: "stripe", id: "stripe" }, async (opts) => {
	console.log("opts")
	return { body: "Hello, World!" }
})

export const { GET, POST, PUT } = serve({
	client: hazel,
	secret: "",
	webhooks: [test],
})

// export const runtime = "edge"
