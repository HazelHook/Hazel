import { cn } from "@/lib/utils"
import { component$, type QwikIntrinsicElements } from "@builder.io/qwik"

type InputProps = QwikIntrinsicElements["input"]

const Input = component$<InputProps>(({ class: className, ...props }) => {
	return (
		// @ts-expect-error
		<input
			class={cn(
				"flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	)
})

export { Input }
