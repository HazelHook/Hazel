import { ReactElement, ReactNode } from "react"

import { cn } from "./utils"

export const Container = ({
	children,
	className,
}: {
	className?: string
	children: ReactNode | ReactElement
}) => {
	return <main className={cn("py-8 container space-y-12", className)}>{children}</main>
}
