import { ReactNode } from "react"
import { Separator } from "./separator"
import Heading from "./heading"

export const PageHeader = ({
	title,
	subtitle,
	children,
}: {
	title: string
	subtitle: string
	children?: ReactNode
}) => {
	return (
		<div className="space-y-6">
			<div className="flex flex-row justify-between">
				<div className="flex flex-col gap-3">
					<Heading type={2}>{title}</Heading>
					<p className="text-sm text-muted-foreground">{subtitle}</p>
				</div>

				{children}
			</div>
			<Separator />
		</div>
	)
}
