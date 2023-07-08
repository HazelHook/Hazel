"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const LinkTabList = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
			className,
		)}
		{...props}
	/>
))

const LinkTab = React.forwardRef<React.ElementRef<typeof Link>, React.ComponentPropsWithoutRef<typeof Link>>(
	({ className, ...props }, ref) => {
		const href = props.href
		const pathname = usePathname()

		return (
			<Link
				ref={ref}
				className={cn(
					"inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
					href === pathname && "bg-background text-foreground shadow-s",
					className,
				)}
				{...props}
			/>
		)
	},
)

export { LinkTabList, LinkTab }
