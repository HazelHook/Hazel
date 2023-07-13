import { createIntegrationForm } from "../common";


export const basicAuthForm = createIntegrationForm({
	name: "basic_auth",
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
