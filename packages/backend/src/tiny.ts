import { Tinybird } from "@chronark/zod-bird"
import { z } from "zod"

export const Tiny = (token: string) => {
	const tb = new Tinybird({ token })

	const publishRequestEvent = tb.buildIngestEndpoint({
		datasource: "request_events",
		event: z.object({
			timestamp: z.string(),
			version: z.string(),
			request_id: z.string(),
			customer_id: z.string(),
			source_id: z.string(),

			body: z.string(),
			headers: z.string(),
		}),
	})

	return { publishRequestEvent }
}
