import type { Provider } from "@supabase/supabase-js"

const production = process.env.NODE_ENV === "production"

export function getBaseUrl() {
	if (typeof window !== "undefined") return ""
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
	return `http://localhost:${process.env.PORT || "3000"}`
}

export const configuration = {
	site: {
		name: "Hazel - Webhook",
		description: "Amazing Webhook app wow",
		themeColor: "#ffffff",
		themeColorDark: "#0a0a0a",
		siteUrl: getBaseUrl(),
		siteName: "Hazel",
		twitterHandle: "@makisuo__",
		githubHandle: "makisuo",
		language: "en",
		convertKitFormId: "",
		locale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
		locales: ["en", "de"],
	},
	auth: {
		// ensure this is the same as your Supabase project. By default - it's true
		requireEmailConfirmation: process.env.NEXT_PUBLIC_REQUIRE_EMAIL_CONFIRMATION === "true",
		// NB: Enable the providers below in the Supabase Console
		// in your production project
		providers: {
			emailPassword: true,
			phoneNumber: false,
			magicLink: false,
			oAuth: ["google", "github"] as Provider[],
		},
	},
	production,
	environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
	paths: {
		home: "/",
		signIn: "/auth/login",
		signUp: "/auth/sign-up",
		signInMfa: "/auth/verify",
		onboarding: "/onboarding",
		switch: "/switch",
		authCallback: "/auth/callback",
		settings: {
			profile: "settings/profile",
			authentication: "settings/profile/authentication",
			email: "settings/profile/email",
			password: "settings/profile/password",
		},
	},
	email: {
		host: "",
		port: 587,
		user: "",
		password: "",
		senderAddress: "Hazel Team <info@hazelapp.dev>",
	},
}

export default configuration
