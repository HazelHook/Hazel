import { type ReactNode } from "react"

import { getCachedSource } from "@/lib/orm"
import { NavTabs } from "@/components/ui/NavTabs"
import { TabsTrigger } from "@/components/ui/tabs"

const ConnectionLayout = async ({
	children,
	params,
}: {
	children: ReactNode
	params: {
		id: string
	}
}) => {
	const source = await getCachedSource({ publicId: params.id })

	return (
		<main className="p-4 space-y-4 h-full">
			<div className="flex flex-row justify-between mb-4">
				<div>
					<h3 className="text-xl font-semibold">Source</h3>
					<h4 className="text-lg text-muted-foreground">{source.name}</h4>
				</div>
			</div>
			<NavTabs>
				<TabsTrigger value="/">Overview</TabsTrigger>
				<TabsTrigger value="/events">Events</TabsTrigger>
				<TabsTrigger value="/settings">Settings</TabsTrigger>
			</NavTabs>
			{children}
		</main>
	)
}

export default ConnectionLayout
