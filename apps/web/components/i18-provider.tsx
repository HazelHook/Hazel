"use client"

import { I18nProviderClient } from "@/i18n/client"
import { ReactNode } from "react"

export const I18Provider = ({ children }: { children: ReactNode }) => {
	return <I18nProviderClient locale={"en"}>{children}</I18nProviderClient>
}
