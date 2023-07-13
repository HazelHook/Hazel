interface NavbarItem {
	name: string
	href: string
	[key: string]: any
}

interface FooterItem {
	title: string
	item: NavbarItem[]
}

interface AppConfig {
	navbar: NavbarItem[]
	footer: FooterItem[]
}

export const appConfig: AppConfig = {
	navbar: [
		{ name: "Pricing", href: "/#pricing" },
		{ name: "Docs", href: "https://docs.hazelhook.dev", target: "__blank" },
		{ name: "Blog", href: "/blog" },
		{ name: "Changelog", href: "/changelog" },
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
				{ name: "Changelog", href: "/changelog" },
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
}
