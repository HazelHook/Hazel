import { match } from "ts-pattern"
import { cn } from "ui"

interface StatusProps {
	status: "error" | "success" | "pending"
	size?: number
	className?: string
	errorColor?: string
	successColor?: string
	pendingColor?: string
}

export const Status = ({ status, size = 5, className, errorColor, successColor, pendingColor }: StatusProps) => {
	return (
		<div
			className={cn(
				`h-${size} w-${size} rounded-sm`,
				match(status)
					.with("error", () => errorColor || "bg-red-600")
					.with("success", () => successColor || "bg-green-500")
					.with("pending", () => pendingColor || "bg-yellow-500")
					.exhaustive(),
				className,
			)}
		/>
	)
}
