import { z } from "zod"

import { createIntegrationForm } from "../../types"

export const basicAuthForm = createIntegrationForm({
	name: "basic_auth",
	schema: {
		username: {
			validator: z.string(),
		},
		password: {
			validator: z.string(),
		},
	},
})
