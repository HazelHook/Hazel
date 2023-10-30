import { Hazel } from "./hazel"

const hazel = new Hazel({ id: "wow" })

const test = hazel.createWebhook({ event: "hello-hook" }, async ({ event }) => {
	return { event, body: "Hello, World!" }
})
