import { z } from "zod"

import { createIntegrationForm } from "../../types"

export const postmarkForm = createIntegrationForm({
	name: "postmark",
	schema: {
		username: {
			validator: z.string(),
		},
		password: {
			validator: z.string(),
		},
	},
})
