import db from "@/lib/db"
import { getCachedConnection } from "@/lib/orm"
import { type ReactNode } from "react"
import { NavTabs } from "./_components/NavTabs"
import { TabsTrigger } from "@/components/ui/tabs"
import { notFound } from "next/navigation"

const ConnectionLayout = async ({
	children,
	params,
}: {
	children: ReactNode
	params: {
		id: string
	}
}) => {
	const connection = await getCachedConnection({ publicId: params.id, db })

	if (!connection) {
		notFound()
	}

	return (
		<main className="p-4 space-y-4">
			<div className="flex flex-row justify-between mb-4">
				<div>
					<h3 className="text-xl font-semibold">Connection</h3>
					<h4 className="text-lg text-muted-foreground">{connection.name}</h4>
				</div>
			</div>
			<NavTabs>
				<TabsTrigger value="/">Overview</TabsTrigger>
				<TabsTrigger value="/events">Events</TabsTrigger>
				<TabsTrigger value="/advanced">Advanced</TabsTrigger>
				<TabsTrigger value="/settings">Settings</TabsTrigger>
			</NavTabs>
			{children}
		</main>
	)
}

export default ConnectionLayout
