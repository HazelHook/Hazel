import { type ReactNode } from "react"
import Link from "next/link"

import { auth } from "@/lib/auth"
import { getCachedSource } from "@/lib/orm"

import { buttonVariants } from "@hazel/ui/button"
import { LinkTab } from "@hazel/ui/link-tabs"
import { NavTabs } from "@hazel/ui/nav-tabs"
import Heading from "@hazel/ui/heading"
import { SimpleTooltip } from "@hazel/ui/tooltip"
import { InfoCircleIcon, LogInLeftIcon } from "@hazel/icons"
import { Container } from "@hazel/ui/container"

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
	const toolSlug = source?.integration?.tool

	return (
		<Container>
			<div className="flex flex-row justify-between mb-4">
				<div>
					<div className="flex gap-2 items-center">
						{toolSlug ? (
							<img src={`/assets/integrations/${toolSlug}.svg`} alt={toolSlug} className="w-7 h-7" />
						) : (
							<LogInLeftIcon className="w-7 h-7 text-muted-foreground" />
						)}

						<Heading className="pb-0" type={2}>
							Source Overview
						</Heading>

						<SimpleTooltip content="Source Overview">
							<InfoCircleIcon />
						</SimpleTooltip>
					</div>
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
				<LinkTab href={`/source/${params.id}/settings`}>Settings</LinkTab>
			</NavTabs>
			{children}
		</Container>
	)
}

export default ConnectionLayout
