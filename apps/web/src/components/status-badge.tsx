import { cn } from "@/lib/utils"

import { Badge } from "@hazel/ui/badge"
import { match } from "ts-pattern"

interface StatusProps {
	status: "error" | "success" | "pending"
}

export const StatusBadge = ({ status }: StatusProps) => {
	return (
		<Badge
			className={cn(
				match(status)
					.with("success", () => "bg-emerald-500")
					.otherwise(() => ""),
			)}
			variant={
				match(status)
					.with("error", () => "error")
					.with("success", () => "default")
					.with("pending", () => "outline")
					.exhaustive() as any
			}
		>
			{match(status)
				.with("error", () => "Error")
				.with("success", () => "Success")
				.with("pending", () => "Pending")
				.exhaustive()}
		</Badge>
	)
}
