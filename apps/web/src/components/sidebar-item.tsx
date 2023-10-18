"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@hazel/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@hazel/ui/tooltip"

import { cn } from "@/lib/utils"

export const SidebarClientItem = ({
	className,
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
	className?: string
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
				className={cn(active && "bg-muted", "w-full justify-center lg:justify-start", className)}
			>
				{icon}
				<p className="hidden lg:block">{title}</p>
				{endIcon}
			</Button>
		)
	}

	return (
		<Tooltip disableHoverableContent>
			<TooltipTrigger asChild>
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
			</TooltipTrigger>
			<TooltipContent className="lg:hidden" align="center" side="right">
				{title}
			</TooltipContent>
		</Tooltip>
	)
}
