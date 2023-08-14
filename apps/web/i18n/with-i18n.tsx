import initializeServerI18n from "@/i18n/i18n.server"
import getLanguageCookie from "@/i18n/get-language-cookie"
import { use } from "react"

type LayoutOrPageComponent<Params> = React.ComponentType<Params>

export function withI18n<Params extends object>(Component: LayoutOrPageComponent<Params>) {
	return function I18nServerComponentWrapper(params: Params) {
		use(initializeServerI18n(getLanguageCookie()))

		return <Component {...params} />
	}
}
