import { cn } from "@/lib/utils"

export const LiveIcon = ({
	className,
	inactive,
}: {
	className?: string
	inactive?: boolean
}) => {
	return (
		<div className={cn(className, "relative flex h-3 w-3")}>
			<span
				className={cn(
					inactive && "bg-muted/80 opacity-90",
					!inactive && "bg-green-400 opacity-75",
					"absolute inline-flex h-full w-full animate-ping rounded-full",
				)}
			/>
			<span
				className={cn(inactive && "bg-muted", !inactive && "bg-green-500", "relative inline-flex h-3 w-3 rounded-full")}
			/>
		</div>
	)
}
