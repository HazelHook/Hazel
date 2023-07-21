import { type ReactNode } from "react"

import { getCachedConnection } from "@/lib/orm"
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
	const basePath = `/connection/${params.id}`
	const connection = await getCachedConnection({ publicId: params.id })

	return (
		<main className="p-4 space-y-4 h-full">
			<div className="flex flex-row justify-between mb-4">
				<div>
					<h3 className="text-xl font-semibold">Connection</h3>
					<h4 className="text-lg text-muted-foreground">{connection.name}</h4>
				</div>
			</div>
			<NavTabs>
				<LinkTab href={basePath}>Overview</LinkTab>
				<LinkTab href={`${basePath}/events`}>Events</LinkTab>
				<LinkTab href={`${basePath}/advanced`}>Advanced</LinkTab>
				<LinkTab href={`${basePath}/settings`}>Settings</LinkTab>
			</NavTabs>
			{children}
		</main>
	)
}

export default ConnectionLayout
