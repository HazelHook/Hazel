import { type ReactNode } from "react"

import { getCachedDestination } from "@/lib/orm"
import { LinkTab } from "@/components/ui/linkTabs"
import { NavTabs } from "@/components/ui/NavTabs"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"

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
		<main className="p-6 space-y-4">
			<div className="flex flex-row justify-between mb-4">
				<div>
					<h3 className="text-xl font-semibold">Destination</h3>
					<h4 className="text-lg text-muted-foreground">{destination.name}</h4>
				</div>
				<Link className={buttonVariants()} href={`/connection/new?destination=${params.id}`}>
					Add to New Connection
				</Link>
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
