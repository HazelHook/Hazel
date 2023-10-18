import { getRequestConfig as iGetRequestConfig } from "next-intl/server"

const getRequestConfig: any = iGetRequestConfig(async ({ locale }) => ({
	messages: (await import(`./locales/${locale}.json`)).default,
	timeZone: "Europe/Vienna",
}))

export default getRequestConfig
