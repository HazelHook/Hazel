import { Tinybird } from "@chronark/zod-bird"

import { buildTinyBirdRequests } from "./request/tiny-request"
import { buildTinyBirdResponse } from "./response/tiny-response"

export const Tiny = (token: string) => {
	const tb = new Tinybird({ token })

	return {
		requests: buildTinyBirdRequests(tb),
		responses: buildTinyBirdResponse(tb),
	}
}
