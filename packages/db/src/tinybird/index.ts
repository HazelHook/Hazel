import { Tinybird } from "@chronark/zod-bird"

import { buildTinyBirdRequest } from "./model/tiny-request"
import { buildTinyBirdResponse } from "./model/tiny-response"

export const Tiny = (token: string) => {
	const tb = new Tinybird({ token })

	const requests = buildTinyBirdRequest(tb)
	const responses = buildTinyBirdResponse(tb)

	return {
		requests: {
			get: requests.get_request.get,
			publish: requests.get_request.publish,
			kpi: requests.kpi_request.get,
			timeline: requests.timeline_request.get,
		},
		responses: {
			get: responses.get_response.get,
			publish: responses.get_response.publish,
			kpi: responses.kpi_response.get,
			timeline: responses.timeline_response.get,
		}
	}
}
