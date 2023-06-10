process.env.RUST_BACKTRACE = "full"

export async function loadHazelFlux() {
	const { HazelFlux } = await import("./hazelflux.node")
	return {
		fluxTransform({ input, config }) {
			return HazelFlux.transform({
				data: input,
				config,
				mode: process.env.NODE_ENV === "production" ? "prod" : "dev",
			})
		},
	}
}
