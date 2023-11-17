import { cn } from "@/lib/utils"
import { ReactNode } from "react"

export type HorizontalStepProps = {
	className?: string
	children: ReactNode
}

export const HorizontalStep = ({ className, children }: HorizontalStepProps) => {
	return (
		<div className={cn("flex flex-row gap-6 w-full", className)}>
			<div className="border-l border-dashed border-border mt-1 -mb-1 relative before:content-[''] before:absolute before:top-0 before:-left-[9px] before:block before:rounded-full before:bg-border before:h-4 before:w-4" />
			<div className="w-full mb-8">{children}</div>
		</div>
	)
}
