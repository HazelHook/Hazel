import type { PropsWithChildren } from "react"
import If from "@hazel/ui/if"
import classNames from "clsx"

import { LogoIcon } from "./icons/logo"
import Spinner from "./spinner"

export default function PageLoadingIndicator({
	children,
	fullPage,
	displayLogo,
	className,
}: PropsWithChildren<{
	className?: string
	fullPage?: boolean
	displayLogo?: boolean
}>) {
	const useFullPage = fullPage ?? true
	const shouldDisplayLogo = displayLogo ?? true

	return (
		<div
			className={classNames("flex flex-col items-center justify-center space-y-6", className, {
				"fixed top-0 left-0 z-[100] h-screen w-screen bg-white dark:bg-dark-900": useFullPage,
			})}
		>
			<If condition={shouldDisplayLogo}>
				<div className={"my-2"}>
					<LogoIcon />
				</div>
			</If>

			<div className={"text-primary-500"}>
				<Spinner className={"h-12 w-12"} />
			</div>

			<div className={"text-sm font-medium"}>{children}</div>
		</div>
	)
}
