import { AppConfig } from "@/lib/app.types"

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
	landing: {
		integrations: [
			{
				name: "Stripe",
				description: "Tap into capital opportunities spanning various industries, including SaaS, eCommerce, and more.",
				url: "https://stripe.com",
				id: "stripe",
			},
			{
				name: "Github",
				description: "Tap into capital opportunities spanning various industries, including SaaS, eCommerce, and more.",
				url: "https://stripe.com",
				id: "github",
			},
		],
	},
}
