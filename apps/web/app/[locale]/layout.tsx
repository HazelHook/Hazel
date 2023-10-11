import "@/styles/global.css"

import { Metadata } from "next"

import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import NextProgress from "@/components/NProgress"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import AuthProvider from "@/lib/provider/AuthProvider"
import configuration from "@/configuration"

export const metadata: Metadata = {
	title: {
		default: configuration.site.name,
		template: `%s - ${configuration.site.name}`,
	},
	description: configuration.site.description,
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
		<html lang="en" suppressHydrationWarning>
			<head />
			<body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
				<AuthProvider>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						<NextProgress />
						{children}
						<TailwindIndicator />
					</ThemeProvider>
					<Toaster
						position="bottom-right"
						toastOptions={{
							style: {
								background: "hsl(var(--background))",
								color: "hsl(var(--foreground))",
								border: "1px solid hsl(var(--border))",
							},
						}}
					/>
				</AuthProvider>
			</body>
		</html>
	)
}

export const dynamic = "force-dynamic"
