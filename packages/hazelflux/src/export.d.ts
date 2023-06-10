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

export type HazelFlux = {
	fluxTransform({ input, config }: { input: string; config: string }): string
}

export declare function loadHazelFlux(): Promise<HazelFlux>
