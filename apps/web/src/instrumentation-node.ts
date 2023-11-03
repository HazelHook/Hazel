import { BaselimeSDK, VercelPlugin, BetterHttpInstrumentation } from "@baselime/node-opentelemetry"

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
