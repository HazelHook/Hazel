export interface NavbarItem {
	name: string
	href: string
	[key: string]: any
}

export interface FooterItem {
	title: string
	item: NavbarItem[]
}

export interface Integration {
	name: string
	description: string
	id:
		| "hmac"
		| "basic_auth"
		| "api_key"
		| "stripe"
		| "github"
		| "shopify"
		| "gitlab"
		| "linear"
		| "postmark"
		| "typeform"
		| "mailgun"
		| "sendgrid"
		| "resend"
		| "ayden"
		| "jira"
		| "svix"
	url: string
}

export interface AppConfig {
	navbar: NavbarItem[]
	footer: FooterItem[]
	landing: {
		integrations: Integration[]
	}
}
