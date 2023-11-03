import "@/styles/global.css"

import { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"
import configuration from "@hazel/utils/configuration"
import { AuthConfigProvider, AuthProvider } from "@hazel/auth/provider"
import { Toaster } from "sonner"

import { fontSans } from "@/lib/fonts"
import { I18Provider } from "@/lib/provider/i18-provider"
import { cn } from "@/lib/utils"
import NextProgress from "@/components/NProgress"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
}

export const metadata: Metadata = {
	title: {
		default: configuration.site.name,
		template: `%s - ${configuration.site.name}`,
	},
	description: configuration.site.description,

	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon-16x16.png",
		apple: "/apple-touch-icon.png",
	},
}

interface RootLayoutProps {
	children: React.ReactNode
	params: {
		locale: string
	}
}

export default function RootLayout({ children, params }: RootLayoutProps) {
	const isValidLocale = configuration.site.locales.some((cur) => cur === params.locale)

	if (!isValidLocale) {
		notFound()
	}

	return (
		<html lang={params.locale} suppressHydrationWarning>
			<head />
			<body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
				<I18Provider locale={params.locale}>
					<AuthConfigProvider
						providers={configuration.auth.providers}
						config={{
							requireEmailConfirmation: configuration.auth.requireEmailConfirmation,
						}}
						paths={{
							signIn: configuration.paths.signIn,
							signUp: configuration.paths.signUp,
							signInRedirect: configuration.paths.home,
							signUpRedirect: configuration.paths.home,
							authCallback: configuration.paths.authCallback,
							onboarding: configuration.paths.onboarding,
						}}
					>
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
					</AuthConfigProvider>
				</I18Provider>
			</body>
		</html>
	)
}



export const dynamic = "force-dynamic"
