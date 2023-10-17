import { ReactNode } from "react"

export const PageHeader = ({
	title,
	subtitle,
	children,
}: { title: string; subtitle: string; children?: ReactNode }) => {
	return (
		<div className="flex flex-row justify-between">
			<div className="max-w-md">
				<h1 className="text-3xl font-bold">{title}</h1>
				<p className="text-lg text-muted-foreground">{subtitle}</p>
			</div>
			{children}
		</div>
	)
}
