import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

import { component$, Slot } from "@builder.io/qwik"

import { cn } from "@/lib/utils"
import type { QwikIntrinsicElements } from "@builder.io/qwik"

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
				link: "underline-offset-4 hover:underline text-primary",
			},
			size: {
				default: "h-10 py-2 px-4",
				xs: "h-7 px-2 rounded-md",
				sm: "h-9 px-3 rounded-md",
				lg: "h-11 px-8 rounded-md",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
)

type ButtonBase = QwikIntrinsicElements["button"]

export interface ButtonProps extends ButtonBase, VariantProps<typeof buttonVariants> {
	loading?: boolean
}

const Button = component$<ButtonProps>(({ class: className, variant, size, loading, ...props }) => {
	return (
		// rome-ignore lint/a11y/useButtonType: <explanation>
		<button class={cn(buttonVariants({ variant, size, class: className }))} {...props}>
			{loading && (
				<svg
					class="mr-2 h-4 w-4 animate-spin"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<title>Loader</title>
					<path d="M21 12a9 9 0 1 1-6.219-8.56" />
				</svg>
			)}
			<Slot />
		</button>
	)
})

export { Button, buttonVariants }
