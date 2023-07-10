import { type ReactNode } from "react"

import { getCachedDestination } from "@/lib/orm"
import { LinkTab } from "@/components/ui/linkTabs"
import { NavTabs } from "@/components/ui/NavTabs"

const ConnectionLayout = async ({
	children,
	params,
}: {
	children: ReactNode
	params: {
		id: string
	}
}) => {
	const destination = await getCachedDestination({ publicId: params.id })

	return (
		<main className="p-4 space-y-4 h-full">
			<div className="flex flex-row justify-between mb-4">
				<div>
					<h3 className="text-xl font-semibold">Destination</h3>
					<h4 className="text-lg text-muted-foreground">{destination.name}</h4>
				</div>
			</div>
			<NavTabs>
				<LinkTab href={`/destination/${params.id}`}>Overview</LinkTab>
				<LinkTab href={`/destination/${params.id}/events`}>Events</LinkTab>
				<LinkTab href={`/destination/${params.id}/settings`}>Settings</LinkTab>
			</NavTabs>
			{children}
		</main>
	)
}

export default ConnectionLayout
