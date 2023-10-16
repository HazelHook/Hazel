import { NextIntlClientProvider, useMessages } from "next-intl"
import { ReactNode } from "react"

export type I18ProviderProps = {
	locale: string
	children: ReactNode
}

export const I18Provider = ({ children, locale }: I18ProviderProps) => {
	const messages = useMessages()

	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			{children}
		</NextIntlClientProvider>
	)
}
