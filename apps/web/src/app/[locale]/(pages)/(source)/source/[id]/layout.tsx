import { type ReactNode } from "react"
import Link from "next/link"

import { auth } from "@/lib/auth"
import { getCachedSource } from "@/lib/orm"

import { buttonVariants } from "@hazel/ui/button"
import { LinkTab } from "@hazel/ui/link-tabs"
import { NavTabs } from "@hazel/ui/nav-tabs"

const ConnectionLayout = async ({
	children,
	params,
}: {
	children: ReactNode
	params: {
		id: string
	}
}) => {
	const { workspaceId } = await auth()

	const source = await getCachedSource({ publicId: params.id, workspaceId })
	const slug = source?.integration?.tool
	return (
		<main className="p-6 space-y-4">
			<div className="flex flex-row justify-between mb-4">
				<div>
					<h3 className="text-xl font-semibold">Source</h3>
					<h4 className="text-lg text-muted-foreground">{source?.name}</h4>
				</div>
				<Link className={buttonVariants()} href={`/connection/new?source=${params.id}`}>
					Add to New Connection
				</Link>
				{/* {slug && (
					<div className="h-7 flex gap-4 mb-auto">
						<img src={`/assets/integrations/${slug}.svg`} className="w-7 h-7" />
					</div>
				)} */}
			</div>
			<NavTabs>
				<LinkTab href={`/source/${params.id}`}>Overview</LinkTab>
				<LinkTab href={`/source/${params.id}/events`}>Events</LinkTab>
				<LinkTab href={`/source/${params.id}/settings`}>Settings</LinkTab>
			</NavTabs>
			{children}
		</main>
	)
}

export default ConnectionLayout
