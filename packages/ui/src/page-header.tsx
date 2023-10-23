import { ReactNode } from "react"
import { Separator } from "./separator"

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
		<>
			<div className="flex flex-row justify-between">
				<div className="flex flex-col gap-3">
					<h2 className="text-2xl font-medium">{title}</h2>
					<p className="text-sm text-muted-foreground">{subtitle}</p>
				</div>

				{children}
			</div>
			<Separator />
		</>
	)
}
