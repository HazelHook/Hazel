process.env.RUST_BACKTRACE = "full"

const HazelFlux = require(".")

const flux = {
	input: {
		type: "validated_json",
		config: {
			schema: JSON.stringify({
				type: "object",
				properties: {
					a: {
						type: "string",
					},
					b: {
						type: "string",
					},
				},
			}),
		},
	},
	output: {
		type: "json",
	},
	transformers: [
		{
			type: "uppercase",
		},
		{
			type: "lowercase",
		},
	],
}

export function fluxTransform(input) {
	return HazelFlux.transform({
		data: input,
		config: flux,
		mode: process.env.NODE_ENV === "production" ? "prod" : "dev",
	})
}
