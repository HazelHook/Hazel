import { SelectConnection } from "db/src/schema"

import { fluxTransform } from "../../../hazelflux/src/export"

export function fluxTransformConnection(conn: SelectConnection): string {
	return fluxTransform(conn.fluxConfig)
}
