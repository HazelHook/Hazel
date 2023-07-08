import { Tinybird } from "@chronark/zod-bird"
import { buildTinyBirdResource } from "./request/tiny-request"

export const Tiny = (token: string) => {
	const tb = new Tinybird({ token })

	return {
		requests: buildTinyBirdResource(tb),
		responses: buildTinyBirdResource(tb),
	}
}
