import { IntegrationTool } from "./common"
import { apiKeyForm } from "./custom/api_key"
import { basicAuthForm } from "./custom/basic-auth"
import { hmacForm } from "./custom/hmac"
import { aydenForm } from "./vendor/ayden"
import { githubForm } from "./vendor/github"
import { gitlabForm } from "./vendor/gitlab"
import { jiraForm } from "./vendor/jira"
import { linearForm } from "./vendor/linear"
import { mailgunForm } from "./vendor/mailgun"
import { postmarkForm } from "./vendor/postmark"
import { resendForm } from "./vendor/resend"
import { sendgridForm } from "./vendor/sendgrid"
import { shopifyForm } from "./vendor/shopify"
import { stripeForm } from "./vendor/stripe"
import { svixForm } from "./vendor/svix"
import { typeformForm } from "./vendor/typeform"

export const IntegrationTools = [
	"hmac",
	"basic_auth",
	"api_key",
	"stripe",
	"github",
	"shopify",
	"gitlab",
	"linear",
	"postmark",
	"typeform",
	"mailgun",
	"sendgrid",
	"resend",
	"ayden",
	"jira",
	"svix",
] as const
export type IntegrationTools = typeof IntegrationTools[number]

export const INTEGRATIONS: Record<IntegrationTools, IntegrationTool> = {
	hmac: {
		slug: "hmac",
		name: "HMAC",
		categories: ["development", "custom"],
		subtitle: "Verify the authenticity of the webhook request using HMAC.",
		features: ["authentication"],
		config: hmacForm,
		disabled: false,
	},
	basic_auth: {
		slug: "basic_auth",
		name: "Basic Auth",
		categories: ["development", "custom"],
		subtitle: "Verify the authenticity of the webhook request using Basic Auth.",
		features: ["authentication"],
		config: basicAuthForm,
		disabled: true,
	},
	api_key: {
		slug: "api_key",
		name: "API Key",
		categories: ["development", "custom"],
		subtitle: "Verify the authenticity of the webhook request using an API key.",
		features: ["authentication"],
		config: apiKeyForm,
		disabled: true,
	},
	stripe: {
		slug: "stripe",
		name: "Stripe",
		categories: ["payment"],
		subtitle:
			"Easily integrate and automate webhook processing for Stripe, a comprehensive solution for online payments, and manage transactions more efficiently.",
		features: ["database", "authentication"],
		config: stripeForm,
		disabled: true,
	},
	github: {
		slug: "github",
		name: "GitHub",
		categories: ["development", "project_management"],
		subtitle:
			"Streamline your development and project management processes with automated webhook handling for GitHub, a platform that revolutionized collaboration in coding.",
		features: ["authentication"],
		config: githubForm,
		disabled: true,
	},
	shopify: {
		slug: "shopify",
		name: "Shopify",
		categories: ["development", "payment"],
		subtitle:
			"Simplify e-commerce transaction processing by integrating Shopify's webhook services, making online store management and payments a breeze.",
		features: ["authentication"],
		config: shopifyForm,
		disabled: true,
	},
	gitlab: {
		slug: "gitlab",
		name: "GitLab",
		categories: ["development", "project_management"],
		subtitle:
			"Supercharge your GitLab experience by integrating webhook processing, thereby accelerating your software development and project management tasks.",
		features: ["authentication"],
		config: gitlabForm,
		disabled: true,
	},
	linear: {
		slug: "linear",
		name: "Linear",
		categories: ["project_management"],
		subtitle:
			"Empower your project management capabilities by integrating webhook processing for Linear, thereby ensuring seamless issue tracking and task assignments.",
		features: ["authentication"],
		config: linearForm,
		disabled: true,
	},
	postmark: {
		slug: "postmark",
		name: "Postmark",
		categories: ["crm", "communication"],
		subtitle:
			"Improve your CRM and communication processes with Postmark by enabling efficient webhook processing, ensuring timely email deliveries and customer interactions.",
		features: ["authentication"],
		config: postmarkForm,
		disabled: true,
	},
	typeform: {
		slug: "typeform",
		name: "Typeform",
		categories: ["development"],
		subtitle:
			"Enhance your application's interaction capabilities by integrating with Typeform's webhook services, turning responses into actionable insights quickly and easily.",
		features: ["database", "authentication"],
		config: typeformForm,
		disabled: true,
	},
	mailgun: {
		slug: "mailgun",
		name: "Mailgun",
		categories: ["crm", "communication"],
		subtitle:
			"Optimize your CRM and communication strategies by integrating Mailgun's webhook services, ensuring efficient email delivery and performance tracking.",
		features: ["authentication"],
		config: mailgunForm,
		disabled: true,
	},
	sendgrid: {
		slug: "sendgrid",
		name: "Sendgrid",
		categories: ["crm", "communication"],
		subtitle:
			"Enhance your email communication workflows with Sendgrid's webhooks, for more effective engagement tracking and customer communication.",
		features: ["authentication"],
		config: sendgridForm,
		disabled: true,
	},
	resend: {
		slug: "resend",
		name: "Resend",
		categories: ["crm", "communication"],
		subtitle:
			"Boost your CRM and communication efforts by integrating Resend's webhook services, guaranteeing efficient message delivery and user engagement tracking.",
		features: ["authentication"],
		config: resendForm,
		disabled: true,
	},
	ayden: {
		slug: "ayden",
		name: "Ayden",
		categories: ["payment"],
		subtitle:
			"Take control of your online payments by integrating Ayden's webhooks, enabling seamless and secure transaction processing for your business.",
		features: ["authentication"],
		disabled: true,
		config: aydenForm,
	},
	jira: {
		slug: "jira",
		name: "Jira",
		categories: ["project_management"],
		subtitle:
			"Enhance your project management workflows by integrating with Jira's webhook system, providing real-time updates and issue tracking capabilities.",
		features: ["authentication"],
		config: jiraForm,
		disabled: true,
	},
	svix: {
		slug: "svix",
		name: "Svix",
		categories: ["development"],
		subtitle:
			"Facilitate your development process with Svix, seamlessly connecting your application's webhook events, and reduce the overhead of webhook management.",
		features: ["authentication"],
		config: svixForm,
		disabled: false,
	},
}

export const INTEGRATION_FEATURES = {
	authentication: {
		name: "Authentication",
		slug: "authentication",
		description: "Fully authenticates the webhook request.",
	},
	database: {
		name: "Database",
		slug: "database",
		description: "Stores the webhook request in your database.",
	},
}

export const INTEGRATION_CATERGORIES = {
	payment: { name: "Payment", slug: "payment" },
	communication: { name: "Communication", slug: "communication" },
	email_marketing: { name: "Email Marketing", slug: "email_marketing" },
	development: { name: "Development", slug: "development" },
	project_management: {
		name: "Project Management",
		slug: "project_management",
	},
	crm: { name: "CRM", slug: "crm" },
	custom: { name: "Custom", slug: "custom" },
}
