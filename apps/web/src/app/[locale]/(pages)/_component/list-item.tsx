import { ReactNode } from "react"

export const ListItem = ({
	name,
	description,
}: {
	name: string
	description: ReactNode | string
}) => {
	return (
		<div className="flex flex-col max-w-[250px] justify-start gap-1">
			<p className="text-muted-foreground">{name}</p>
			<div>{description}</div>
		</div>
	)
}
