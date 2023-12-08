import { cn } from "@/lib/utils"
import { Badge } from "@hazel/ui/badge"
import { match } from "ts-pattern"

interface StatusCodeProps {
	statusCode: number
}

export const StatusCodeBadge = ({ statusCode }: StatusCodeProps) => {
	return (
		<Badge
			variant={
				match(statusCode)
					.with(200, 201, 202, () => "success")
					.with(204, 205, () => "info")
					.with(400, () => "warning")
					.with(404, () => "destructive")
					.with(500, 503, () => "destructive")
					.otherwise(() => "default") as any
			}
		>
			{match(statusCode)
				.with(200, () => "OK")
				.with(201, () => "Created")
				.with(202, () => "Accepted")
				.with(204, () => "No Content")
				.with(205, () => "Reset Content")
				.with(400, () => "Bad Request")
				.with(404, () => "Not Found")
				.with(500, () => "Internal Server Error")
				.with(503, () => "Service Unavailable")
				.otherwise(() => "Unknown")}
		</Badge>
	)
}
