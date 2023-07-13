import { createIntegrationForm } from "../common";


export const postmarkForm = createIntegrationForm({
	name: "postmark",
	schema: {
		username: {
			type: "text",
			label: "Username",
		},
		password: {
			type: "secret",
			label: "Password",
		},
	},
})
