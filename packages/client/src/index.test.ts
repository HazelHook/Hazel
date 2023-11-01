import { Hazel } from "./hazel"

const hazel = new Hazel({ id: "wowsies" })

const test = hazel.createWebhook({ event: "hello", id: "hello-hook-id" }, async ({ event }) => {
	return { event, body: "Hello, World!" }
})
