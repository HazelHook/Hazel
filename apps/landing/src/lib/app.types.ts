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
	logoPath: `/images/assets/integrations/${string}`
	url: string
}

export interface AppConfig {
	navbar: NavbarItem[]
	footer: FooterItem[]
	landing: {
		integrations: Integration[]
	}
}
