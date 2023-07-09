import { Tinybird } from "@chronark/zod-bird"

import { buildTinyBirdRequest } from "./model/tiny-request"
import { buildTinyBirdResponse } from "./model/tiny-response"

export const Tiny = (token: string) => {
	const tb = new Tinybird({ token })

	return {
		requests: buildTinyBirdRequest(tb),
		responses: buildTinyBirdResponse(tb),
	}
}
