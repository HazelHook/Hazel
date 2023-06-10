// import { createRequire } from "module"
async function main() {
	const wasmModule = await import("./hazelflux.node")
	// Now use your wasmModule
}

main()

process.env.RUST_BACKTRACE = "full"

// const require = createRequire(import.meta.url)
// const HazelFlux = require(".")

export interface FluxConfig {
	input: Input
	transformers: Transformer[]
	output: Output
}

type TransformerType = "uppercase" | "lowercase"
interface Transformer {
	type: TransformerType
}

type OutputType = "json"
interface Output {
	type: OutputType
}

type Input = JsonInput | ValidatedJsonInput
interface JsonInput {
	type: "json"
}
interface ValidatedJsonInput {
	type: "validated_json"
	config: {
		schema: string
	}
}

const flux: FluxConfig = {
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

export function fluxTransform(input: string): string {
	return HazelFlux.transform({
		data: input,
		config: flux,
		mode: process.env.NODE_ENV === "production" ? "prod" : "dev",
	})
}
