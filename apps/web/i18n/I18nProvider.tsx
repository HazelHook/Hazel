"use client"

import type { i18n } from "i18next"
import isBrowser from "@/core/generic/is-browser"

let client: i18n

function I18nProvider(
	props: React.PropsWithChildren<{
		lang?: string
	}>,
) {
	return <I18nInitializer lang={props.lang}>{props.children}</I18nInitializer>
}

export default I18nProvider

function I18nInitializer({
	lang,
	children,
}: React.PropsWithChildren<{
	lang?: string
}>) {
	if (!client) {
		throw withI18nClient(lang)
	}

	return children
}

async function withI18nClient(lang?: string) {
	if (isBrowser()) {
		const { default: initialize18n } = await import("@/i18n/i18n.client")

		client = await initialize18n(lang)
	} else {
		const { default: initialize18n } = await import("@/i18n/i18n.server")

		client = await initialize18n(lang)
	}
}
