import { IntegrationCard } from "@/app/(pages)/_component/IntegrationCard"
import { DatabaseIcon } from "@/components/icons/pika/database"
import { ShieldCheckIcon } from "@/components/icons/pika/shieldCheck"

export interface IntegrationCategoryData {
	name: string
	slug: string
}
export const INTEGRATION_CATERGORIES = {
	payment: { name: "Payment", slug: "payment" },
	communication: { name: "Communication", slug: "communication" },
	email_marketing: { name: "Email Marketing", slug: "email_marketing" },
	development: { name: "Development", slug: "development" },
	project_management: { name: "Project Management", slug: "project_management" },
	crm: { name: "CRM", slug: "crm" },
}
export type IntegrationCategory = keyof typeof INTEGRATION_CATERGORIES

export interface IntegrationFeatureData {
	name: string
	slug: string
	icon: React.FC
}
export const INTEGRATION_FEATURES = {
	authentication: { name: "Authentication", slug: "authentication", icon: ShieldCheckIcon, description: "Fully authenticates the webhook request." },
	database: { name: "Database", slug: "database", icon: DatabaseIcon, description: "Stores the webhook request in your database." },
}
export type IntegrationFeature = keyof typeof INTEGRATION_FEATURES

export interface Integration {
	name: string
	slug: string
	subtitle?: string
	categories: IntegrationCategory[]
	features?: IntegrationFeature[]
}

export const INTEGRATIONS: Integration[] = [
	{ 
		name: "Stripe", 
		slug: "stripe", 
		categories: ["payment"], 
		subtitle: "Easily integrate and automate webhook processing for Stripe, a comprehensive solution for online payments, and manage transactions more efficiently.",
		features: ["database", "authentication"]
	  },
	  { 
		name: "GitHub", 
		slug: "github", 
		categories: ["development", "project_management"], 
		subtitle: "Streamline your development and project management processes with automated webhook handling for GitHub, a platform that revolutionized collaboration in coding.",
		features: ["authentication"]
	  },
	  { 
		name: "Shopify", 
		slug: "shopify", 
		categories: ["development", "payment"], 
		subtitle: "Simplify e-commerce transaction processing by integrating Shopify's webhook services, making online store management and payments a breeze.",
		features: ["authentication"]
	  },
	  { 
		name: "Jira", 
		slug: "jira", 
		categories: ["project_management"], 
		subtitle: "Enhance your project management workflows by integrating with Jira's webhook system, providing real-time updates and issue tracking capabilities.",
		features: ["authentication"]
	  },
	  { 
		name: "Svix", 
		slug: "svix", 
		categories: ["development"], 
		subtitle: "Facilitate your development process with Svix, seamlessly connecting your application's webhook events, and reduce the overhead of webhook management.",
		features: ["authentication"]
	  },
	  { 
		name: "GitLab", 
		slug: "gitlab", 
		categories: ["development", "project_management"], 
		subtitle: "Supercharge your GitLab experience by integrating webhook processing, thereby accelerating your software development and project management tasks.",
		features: ["authentication"]
	  },
	  { 
		name: "Linear", 
		slug: "linear", 
		categories: ["project_management"], 
		subtitle: "Empower your project management capabilities by integrating webhook processing for Linear, thereby ensuring seamless issue tracking and task assignments.",
		features: ["authentication"]
	  },
	  { 
		name: "Postmark", 
		slug: "postmark", 
		categories: ["crm", "communication"], 
		subtitle: "Improve your CRM and communication processes with Postmark by enabling efficient webhook processing, ensuring timely email deliveries and customer interactions.",
		features: ["authentication"]
	  },
	  { 
		name: "Typeform", 
		slug: "typeform", 
		categories: ["development"], 
		subtitle: "Enhance your application's interaction capabilities by integrating with Typeform's webhook services, turning responses into actionable insights quickly and easily.",
		features: ["database", "authentication"]
	  },
	  { 
		name: "Ayden", 
		slug: "ayden", 
		categories: ["payment"], 
		subtitle: "Take control of your online payments by integrating Ayden's webhooks, enabling seamless and secure transaction processing for your business.",
		features: ["authentication"]
	  },
	  { 
		name: "Mailgun", 
		slug: "mailgun", 
		categories: ["crm", "communication"], 
		subtitle: "Optimize your CRM and communication strategies by integrating Mailgun's webhook services, ensuring efficient email delivery and performance tracking.",
		features: ["authentication"]
	  },
	  { 
		name: "Sendgrid", 
		slug: "sendgrid", 
		categories: ["crm", "communication"], 
		subtitle: "Enhance your email communication workflows with Sendgrid's webhooks, for more effective engagement tracking and customer communication.",
		features: ["authentication"]
	  },
	  { 
		name: "Resend", 
		slug: "resend", 
		categories: ["crm", "communication"], 
		subtitle: "Boost your CRM and communication efforts by integrating Resend's webhook services, guaranteeing efficient message delivery and user engagement tracking.",
		features: ["authentication"]
	  }	  
]

const IntegrationsPage = async () => {
	return (
		<main className="p-4">
			<div className="flex flex-col justify-between mb-4 gap-3 container p-8 space-y-4">
				<h3 className="text-xl font-semibold">Integrations</h3>
				<div className="grid grid-flow-row-dense md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
					{INTEGRATIONS.map((item, index) => (
						<IntegrationCard key={index} {...item} />
					))}
				</div>
			</div>
		</main>
	)
}

export const runtime = "edge"

export default IntegrationsPage
