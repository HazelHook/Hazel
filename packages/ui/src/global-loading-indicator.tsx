import { useTranslations } from "next-intl"
import { PageLoadingIndicator } from "./page-loading-indicator"
import { TopLoadingBarIndicator } from "./top-loading-bar-indicator"

export function GlobalLoadingIndicator({
	children,
	displayLogo = false,
	fullPage = false,
}: React.PropsWithChildren<{
	displayLogo?: boolean
	fullPage?: boolean
}>) {
	const t = useTranslations()
	const Text = children ?? t("common.loading")

	return (
		<>
			<TopLoadingBarIndicator />

			<div className={"flex flex-1 flex-col items-center justify-center py-48"}>
				<PageLoadingIndicator displayLogo={displayLogo} fullPage={fullPage}>
					{Text}
				</PageLoadingIndicator>
			</div>
		</>
	)
}
