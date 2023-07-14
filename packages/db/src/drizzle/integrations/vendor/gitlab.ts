import { createIntegrationForm } from "../common";

export const gitlabForm = createIntegrationForm({
	name: "gitlab",
	schema: {
		webhookSigningSecret: {
			type: "secret",
			label: "API key",
			placeholder: "API key...",
			description:
				"The webhook signing secret for your GitLab account.",
		},
	},
})
