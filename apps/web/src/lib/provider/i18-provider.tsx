import { ReactNode } from "react"

import { NextIntlClientProvider, useMessages } from "next-intl"

export type I18ProviderProps = {
	locale: string
	children: ReactNode
}

export const I18Provider = ({ children, locale }: I18ProviderProps) => {
	const messages = useMessages()

	return (
		<NextIntlClientProvider locale={locale} messages={messages} timeZone={"Europe/Vienna"}>
			{children}
		</NextIntlClientProvider>
	)
}
