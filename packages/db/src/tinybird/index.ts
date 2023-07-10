import { Tinybird } from "@chronark/zod-bird"

import { buildTinyBirdRequest } from "./model/tiny-request"
import { buildTinyBirdResponse } from "./model/tiny-response"

export const Tiny = (token: string) => {
	const tb = new Tinybird({ token })

	const request = buildTinyBirdRequest(tb)
	const response = buildTinyBirdResponse(tb)

	return {
		request,
		response,
	}
}
