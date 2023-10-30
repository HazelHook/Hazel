export const stripeWebhook = hazel.createWebhook({ event: "test/hello.world" }, async ({ event, context }) => {
	return { event, body: "Hello, World!" }
})

export const helloWorldFunc = hazel.createFunction({ event: "func/hello.world" }, async ({ event, context }) => {
	return { event, body: "Hello, World!" }
})

export const { POST } = serve({
	client: hazelClient,
	hooks: [stripeWebhook],
	functions: [helloWorldFunc],
})
