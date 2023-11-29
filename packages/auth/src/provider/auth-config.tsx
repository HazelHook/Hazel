"use client"

import { createContext, useContext, useState } from "react"

import { Provider } from "@hazel/supabase"

export type Providers = {
	oAuth: Provider[]
	emailPassword: boolean
	phoneNumber: boolean
	magicLink: boolean
}

export type Paths = {
	signIn: string
	signUp: string
	onboarding: string
	signInRedirect: string
	signUpRedirect: string
	authCallback: string
}

export type AuthConfig = {
	paths: Paths
	providers: Providers
	config: {
		requireEmailConfirmation: boolean
	}
}

const AuthConfigContext = createContext<AuthConfig | null>(null)

export const useAuthConfig = () => {
	const context = useContext(AuthConfigContext)

	if (!context) {
		throw new Error("useAuthConfig must be used within a AuthLayout")
	}

	return context
}

export const AuthConfigProvider: React.FCC<AuthConfig> = ({ children, paths, providers, config }) => {
	const [state, setState] = useState<AuthConfig>({ paths, providers, config })

	return <AuthConfigContext.Provider value={state}>{children}</AuthConfigContext.Provider>
}
