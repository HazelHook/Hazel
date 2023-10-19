import type { PropsWithChildren } from "react"
import classNames from "clsx"

import If from "./if"
import { Spinner } from "./spinner"
import { Logo } from "./logo"

export function PageLoadingIndicator({
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
				"fixed top-0 left-0 z-[100] h-screen w-screen bg-background": useFullPage,
			})}
		>
			<If condition={shouldDisplayLogo}>
				<div className={"my-2"}>
					<Logo />
				</div>
			</If>

			<div className={"text-primary-500"}>
				<Spinner className={"h-12 w-12"} />
			</div>

			<div className={"text-sm font-medium"}>{children}</div>
		</div>
	)
}
