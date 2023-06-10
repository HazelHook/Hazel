import { SelectConnection } from "db/src/schema"

import { loadHazelFlux } from "../../../hazelflux/src/export"

export async function fluxTransformConnection(conn: SelectConnection, input: string): Promise<string> {
	const hazelflux = await loadHazelFlux()

	return hazelflux.fluxTransform({
		config: conn.fluxConfig,
		input,
	})
}
