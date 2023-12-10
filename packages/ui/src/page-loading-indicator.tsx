import type { PropsWithChildren } from "react"

import classNames from "clsx"

import { If } from "./if"
import { Logo } from "./logo"
import { Spinner } from "./spinner"

export type LoadingIndicatorProps = {
	className?: string
	fullPage?: boolean
	displayLogo?: boolean
}

export function LoadingIndicator({
	children,
	fullPage = false,
	displayLogo = true,
	className,
}: PropsWithChildren<LoadingIndicatorProps>) {
	return (
		<div
			className={classNames("flex flex-col items-center justify-center space-y-6", className, {
				"fixed top-0 left-0 z-[100] h-screen w-screen bg-background": fullPage,
			})}
		>
			<If condition={displayLogo}>
				<div className={"my-2"}>
					<Logo />
				</div>
			</If>

			<div className={"text-primary"}>
				<Spinner className={"h-12 w-12"} />
			</div>

			<div className={"text-sm font-medium"}>{children}</div>
		</div>
	)
}

export function PageLoadingIndicator({ children, ...rest }: PropsWithChildren<LoadingIndicatorProps>) {
	return (
		<div className="flex justify-center items-center min-h-screen">
			<LoadingIndicator {...rest}>{children}</LoadingIndicator>
		</div>
	)
}
