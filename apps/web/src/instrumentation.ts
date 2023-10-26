export async function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		const { BaselimeSDK, VercelPlugin, BetterHttpInstrumentation } = await import("@baselime/node-opentelemetry")

		const sdk = new BaselimeSDK({
			serverless: true,
			service: "hazel",
			instrumentations: [
				new BetterHttpInstrumentation({
					plugins: [new VercelPlugin()],
				}),
			],
		})

		sdk.start()
	}
}
