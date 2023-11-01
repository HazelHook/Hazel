import { serve } from "@hazel/client/next"
import { Hazel } from "@hazel/client/hazel"

const hazel = new Hazel({ id: "hazel" })

const test = hazel.createWebhook({ event: "hello", id: "hello" }, async (opts) => {
	console.log(opts, "opts")
	return { body: "Hello, World!" }
})

export const { GET, POST, PUT } = serve({
	client: hazel,
	secret: "",
	webhooks: [test],
})
