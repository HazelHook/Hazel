"use client"

import * as React from "react"

import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "./utils"

const badgeVariants = cva(
	"inline-flex items-center border rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
	{
		variants: {
			variant: {
				default: "bg-primary hover:bg-primary/80 border-transparent text-primary-foreground",
				secondary: "bg-secondary hover:bg-secondary/60 border-transparent text-secondary-foreground",
				destructive:
					"border border-destructive/40 bg-destructive hover:bg-destructive/80 border-transparent text-destructive-foreground",
				success: "border border-emerald-500/40 bg-emerald-500/20 text-success-foreground",
				outline: "text-foreground",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
