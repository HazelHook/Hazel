import "@/styles/global.css"

import { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import NextProgress from "@/components/NProgress"

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

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning>
				<head />
				<body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						<NextProgress />
						{children}
						<TailwindIndicator />
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	)
}
