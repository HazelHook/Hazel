import { z } from "zod"

import { createIntegrationForm } from "../../types"

export const apiKeyForm = createIntegrationForm({
	name: "api_key",
	schema: {
		username: {
			validator: z.string(),
		},
		password: {
			validator: z.string(),
		},
	},
})
