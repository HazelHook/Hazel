import * as React from "react"

import { cva, VariantProps } from "class-variance-authority"

import { cn } from "./utils"
import { IconRefresh } from "@tabler/icons-react"

const buttonVariants = cva(
	"inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				outline: "border border-input hover:bg-accent hover:text-accent-foreground",
				secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				destructive_ghost: "text-red-400 hover:bg-accent",
				link: "underline-offset-4 hover:underline text-primary",
			},
			size: {
				default: "h-10 py-2 px-4",
				xs: "h-7 px-2 rounded-md",
				sm: "h-9 px-3 rounded-md",
				lg: "h-11 px-8 rounded-md",
				icon: "h-10 w-10 aspect-square",
				none: "",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
)

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, children, loading, ...props }, ref) => {
		return (
			// biome-ignore lint/a11y/useButtonType: <explanation>
			<button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
				{loading && <IconRefresh className="mr-2 h-4 w-4 animate-spin" />}
				{children}
			</button>
		)
	},
)
Button.displayName = "Button"

export { Button, buttonVariants }
