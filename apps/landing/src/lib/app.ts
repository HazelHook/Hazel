import { AppConfig } from "@/lib/app.types"

export const appConfig: AppConfig = {
	navbar: [
		{ name: "Pricing", href: "/#pricing" },
		{ name: "Docs", href: "https://docs.hazelhook.dev", target: "__blank" },
		{ name: "Blog", href: "/blog" },
		// { name: "Changelog", href: "/changelog" },
	],
	footer: [
		{
			title: "Navigation",
			item: [
				{ name: "Home", href: "/" },
				{ name: "App", href: "https://app.hazelhook.dev" },
				{ name: "Pricing", href: "/#pricing" },
				{ name: "Docs", href: "https://docs.hazelhook.dev", target: "__blank" },
				{ name: "Blog", href: "/blog" },
			],
		},
		{
			title: "Stay Updated",
			item: [
				// { name: "Changelog", href: "/changelog" },
				{ name: "Roadmap", href: "/roadmap" },
			],
		},
		{
			title: "Socials",
			item: [
				{ name: "@HazelHook", href: "https://twitter.com/HazelHook" },
				{ name: "@makisuo__", href: "https://twitter.com/makisuo__" },
			],
		},
	],
	landing: {
		integrations: [
			{
				id: "stripe",
				name: "Stripe",
				categories: ["payment"],
				url: "https://stripe.com",
				description:
					"Easily integrate and automate webhook processing for Stripe, a comprehensive solution for online payments, and manage transactions more efficiently.",
				features: ["database", "authentication"],
			},
			{
				id: "github",
				name: "GitHub",
				url: "https://github.com",
				categories: ["development", "project_management"],
				description:
					"Streamline your development and project management processes with automated webhook handling for GitHub, a platform that revolutionized collaboration in coding.",
				features: ["authentication"],
			},
			{
				id: "shopify",
				name: "Shopify",
				url: "https://shopify.com",
				categories: ["development", "payment"],
				description:
					"Simplify e-commerce transaction processing by integrating Shopify's webhook services, making online store management and payments a breeze.",
				features: ["authentication"],
			},
			{
				id: "gitlab",
				name: "GitLab",
				categories: ["development", "project_management"],
				description:
					"Supercharge your GitLab experience by integrating webhook processing, thereby accelerating your software development and project management tasks.",
				features: ["authentication"],
				url: "https://gitlab.com",
			},
			{
				id: "linear",
				name: "Linear",
				categories: ["project_management"],
				description:
					"Empower your project management capabilities by integrating webhook processing for Linear, thereby ensuring seamless issue tracking and task assignments.",
				features: ["authentication"],
				url: "https://linear.com",
			},
			{
				id: "hmac",
				name: "HMAC",
				categories: ["development", "custom"],
				description: "Verify the authenticity of the webhook request using HMAC.",
				features: ["authentication"],
				url: "",
			},
			{
				id: "basic_auth",
				name: "Basic Auth",
				categories: ["development", "custom"],
				description: "Verify the authenticity of the webhook request using Basic Auth.",
				features: ["authentication"],
				url: "",
			},
			{
				id: "api_key",
				name: "API Key",
				categories: ["development", "custom"],
				description: "Verify the authenticity of the webhook request using an API key.",
				features: ["authentication"],
				url: "",
			},
			{
				id: "postmark",
				name: "Postmark",
				categories: ["crm", "communication"],
				description:
					"Improve your CRM and communication processes with Postmark by enabling efficient webhook processing, ensuring timely email deliveries and customer interactions.",
				features: ["authentication"],
				url: "https://postmark.com",
			},
			{
				id: "typeform",
				name: "Typeform",
				categories: ["development"],
				description:
					"Enhance your application's interaction capabilities by integrating with Typeform's webhook services, turning responses into actionable insights quickly and easily.",
				features: ["database", "authentication"],
				url: "https://typeform.com",
			},
			{
				id: "mailgun",
				name: "Mailgun",
				categories: ["crm", "communication"],
				description:
					"Optimize your CRM and communication strategies by integrating Mailgun's webhook services, ensuring efficient email delivery and performance tracking.",
				features: ["authentication"],
				url: "https://mailgun.com",
			},
			{
				id: "sendgrid",
				name: "Sendgrid",
				categories: ["crm", "communication"],
				description:
					"Enhance your email communication workflows with Sendgrid's webhooks, for more effective engagement tracking and customer communication.",
				features: ["authentication"],
				url: "https://sendgrid.com",
			},
			{
				id: "resend",
				name: "Resend",
				categories: ["crm", "communication"],
				description:
					"Boost your CRM and communication efforts by integrating Resend's webhook services, guaranteeing efficient message delivery and user engagement tracking.",
				features: ["authentication"],
				url: "https://resend.com",
			},
			{
				id: "ayden",
				name: "Ayden",
				categories: ["payment"],
				description:
					"Take control of your online payments by integrating Ayden's webhooks, enabling seamless and secure transaction processing for your business.",
				features: ["authentication"],
				// disabled: true,
				url: "https://ayden.com",
			},
			{
				id: "jira",
				name: "Jira",
				categories: ["project_management"],
				description:
					"Enhance your project management workflows by integrating with Jira's webhook system, providing real-time updates and issue tracking capabilities.",
				features: ["authentication"],
				// disabled: true,
				url: "https://jira.com",
			},
			{
				id: "svix",
				name: "Svix",
				categories: ["development"],
				description:
					"Facilitate your development process with Svix, seamlessly connecting your application's webhook events, and reduce the overhead of webhook management.",
				features: ["authentication"],
				// disabled: true,
				url: "https://svix.com",
			},
		],
	},
}
