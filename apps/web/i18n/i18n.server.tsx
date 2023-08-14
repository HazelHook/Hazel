import { createInstance } from "i18next"
import { initReactI18next } from "react-i18next/initReactI18next"
import getI18nSettings from "./i18n.settings"

async function initializeServerI18n(lang?: Maybe<string>) {
	const i18nInstance = createInstance()
	const settings = getI18nSettings(lang)
	const namespaces = Array.isArray(settings.ns) ? settings.ns : [settings.ns]
	const bundles = await createLanguageBundles(namespaces, settings.lng)

	await i18nInstance.use(initReactI18next).init({
		...settings,
		resources: {
			[settings.lng]: bundles,
		},
	})

	return i18nInstance
}

export default initializeServerI18n

async function createLanguageBundles(namespaces: string[], language: string) {
	const bundles = await Promise.all(
		namespaces.map((namespace) => {
			return readTranslationFile(language, namespace)
		}),
	)

	return namespaces.reduce((acc, namespace, index) => {
		return {
			...acc,
			[namespace]: bundles[index],
		}
	}, {})
}

async function readTranslationFile(language: string, fileName: string) {
	const { readFile } = await import("fs/promises")

	try {
		const prefix = `${process.cwd()}/public/locales`

		const file = await readFile(`${prefix}/${language}/${fileName}.json`, "utf8")

		return JSON.parse(file)
	} catch (e) {
		console.error(`Error: failed to read translation file: ${fileName}. Does it exist?`)

		return {}
	}
}
