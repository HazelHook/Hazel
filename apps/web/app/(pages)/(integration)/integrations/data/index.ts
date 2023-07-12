import { DatabaseIcon } from "@/components/icons/pika/database"
import { ShieldCheckIcon } from "@/components/icons/pika/shieldCheck"
import { IntegrationForm } from "@/app/(pages)/(integration)/integrations/data/common"
import { hmacForm } from "@/app/(pages)/(integration)/integrations/data/integrations/hmac"
import { stripeForm } from "@/app/(pages)/(integration)/integrations/data/integrations/stripe"

export interface IntegrationCategoryData {
	name: string
	slug: string
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
export type IntegrationCategory = keyof typeof INTEGRATION_CATERGORIES

export interface IntegrationFeatureData {
	name: string
	slug: string
	icon: React.FC
}
export const INTEGRATION_FEATURES = {
	authentication: {
		name: "Authentication",
		slug: "authentication",
		icon: ShieldCheckIcon,
		description: "Fully authenticates the webhook request.",
	},
	database: {
		name: "Database",
		slug: "database",
		icon: DatabaseIcon,
		description: "Stores the webhook request in your database.",
	},
}
export type IntegrationFeature = keyof typeof INTEGRATION_FEATURES

export interface Integration {
	name: string & {}
	slug: string
	categories: IntegrationCategory[]
	form?: IntegrationForm<any>
	subtitle?: string
	features?: IntegrationFeature[]
}

export const INTEGRATIONS: Record<any, Integration> = {
	hmac: {
		slug: "hmac",
		name: "HMAC",
		categories: ["development", "custom"],
		subtitle: "Verify the authenticity of the webhook request using HMAC.",
		features: ["authentication"],
		form: hmacForm,
	},
	basic_auth: {
		slug: "basic_auth",
		name: "Basic Auth",
		categories: ["development", "custom"],
		subtitle: "Verify the authenticity of the webhook request using Basic Auth.",
		features: ["authentication"],
	},
	api_key: {
		slug: "api_key",
		name: "API Key",
		categories: ["development", "custom"],
		subtitle: "Verify the authenticity of the webhook request using an API key.",
		features: ["authentication"],
	},
	stripe: {
		slug: "stripe",
		name: "Stripe",
		categories: ["payment"],
		subtitle:
			"Easily integrate and automate webhook processing for Stripe, a comprehensive solution for online payments, and manage transactions more efficiently.",
		features: ["database", "authentication"],
		form: stripeForm,
	},
	github: {
		slug: "github",
		name: "GitHub",
		categories: ["development", "project_management"],
		subtitle:
			"Streamline your development and project management processes with automated webhook handling for GitHub, a platform that revolutionized collaboration in coding.",
		features: ["authentication"],
	},
	shopify: {
		slug: "shopify",
		name: "Shopify",
		categories: ["development", "payment"],
		subtitle:
			"Simplify e-commerce transaction processing by integrating Shopify's webhook services, making online store management and payments a breeze.",
		features: ["authentication"],
	},
	jira: {
		slug: "jira",
		name: "Jira",
		categories: ["project_management"],
		subtitle:
			"Enhance your project management workflows by integrating with Jira's webhook system, providing real-time updates and issue tracking capabilities.",
		features: ["authentication"],
	},
	svix: {
		slug: "svix",
		name: "Svix",
		categories: ["development"],
		subtitle:
			"Facilitate your development process with Svix, seamlessly connecting your application's webhook events, and reduce the overhead of webhook management.",
		features: ["authentication"],
	},
	gitlab: {
		slug: "gitlab",
		name: "GitLab",
		categories: ["development", "project_management"],
		subtitle:
			"Supercharge your GitLab experience by integrating webhook processing, thereby accelerating your software development and project management tasks.",
		features: ["authentication"],
	},
	linear: {
		slug: "linear",
		name: "Linear",
		categories: ["project_management"],
		subtitle:
			"Empower your project management capabilities by integrating webhook processing for Linear, thereby ensuring seamless issue tracking and task assignments.",
		features: ["authentication"],
	},
	postmark: {
		slug: "postmark",
		name: "Postmark",
		categories: ["crm", "communication"],
		subtitle:
			"Improve your CRM and communication processes with Postmark by enabling efficient webhook processing, ensuring timely email deliveries and customer interactions.",
		features: ["authentication"],
	},
	typeform: {
		slug: "typeform",
		name: "Typeform",
		categories: ["development"],
		subtitle:
			"Enhance your application's interaction capabilities by integrating with Typeform's webhook services, turning responses into actionable insights quickly and easily.",
		features: ["database", "authentication"],
	},
	ayden: {
		slug: "ayden",
		name: "Ayden",
		categories: ["payment"],
		subtitle:
			"Take control of your online payments by integrating Ayden's webhooks, enabling seamless and secure transaction processing for your business.",
		features: ["authentication"],
	},
	mailgun: {
		slug: "mailgun",
		name: "Mailgun",
		categories: ["crm", "communication"],
		subtitle:
			"Optimize your CRM and communication strategies by integrating Mailgun's webhook services, ensuring efficient email delivery and performance tracking.",
		features: ["authentication"],
	},
	sendgrid: {
		slug: "sendgrid",
		name: "Sendgrid",
		categories: ["crm", "communication"],
		subtitle:
			"Enhance your email communication workflows with Sendgrid's webhooks, for more effective engagement tracking and customer communication.",
		features: ["authentication"],
	},
	resend: {
		slug: "resend",
		name: "Resend",
		categories: ["crm", "communication"],
		subtitle:
			"Boost your CRM and communication efforts by integrating Resend's webhook services, guaranteeing efficient message delivery and user engagement tracking.",
		features: ["authentication"],
	},
}

export type IntegrationSlug = keyof typeof INTEGRATIONS
