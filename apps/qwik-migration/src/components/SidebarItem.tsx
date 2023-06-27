"use client"

import { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Slot } from "@builder.io/qwik"

export const SidebarClientItem = ({
	href,
	icon,
	title,
	target,
	disabled,
	endIcon,
	size = "sm",
}: {
	href: string
	icon: ReactNode
	endIcon?: ReactNode
	title: string
	target?: string
	disabled?: boolean
	size?: "default" | "xs" | "sm" | "lg"
}) => {
	const pathname = usePathname()

	const active = pathname === href

	if (disabled) {
		return (
			<Button
				variant="ghost"
				disabled={disabled}
				size={size}
				className={cn(active && "bg-muted", "w-full justify-center lg:justify-start")}
			>
				<Slot name="icon" />
				<p className="hidden lg:block">{title}</p>
				<Slot name="endIcon" />
			</Button>
		)
	}

	return (
		<Link className="click" href={href} target={target}>
			<Button
				variant="ghost"
				disabled={disabled}
				size={size}
				className={cn(active && "bg-muted", "w-full justify-center lg:justify-start")}
			>
				{icon}
				<p className="hidden lg:block">{title}</p>
				{endIcon}
			</Button>
		</Link>
	)
}
