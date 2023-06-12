import "@/styles/globals.css"

import { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/Sidebar"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon-16x16.png",
		apple: "/apple-touch-icon.png",
	},
}

interface RootLayoutProps {
	children: React.ReactNode
	params: {
		org?: string
		slug?: string
	}
}

export default function RootLayout({ children, params }: RootLayoutProps) {
	return (
		<div className="relative flex min-h-screen flex-col">
			<SiteHeader />
			<div className="grid grow lg:grid-cols-5">
				{/* @ts-expect-error */}
				<Sidebar
					params={params}
					className="fixed flex w-12 flex-col justify-between transition-[width] duration-1000 lg:w-64"
				/>
				<div className="col-span-full ml-12 border-l transition-[margin] duration-1000 lg:ml-64">{children}</div>
			</div>
		</div>
	)
}
