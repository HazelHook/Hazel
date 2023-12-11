import { type ReactNode } from "react"
import Link from "next/link"

import { auth } from "@/lib/auth"
import { getCachedSource } from "@/lib/orm"

import { buttonVariants } from "@hazel/ui/button"
import { LinkTab } from "@hazel/ui/link-tabs"
import { NavTabs } from "@hazel/ui/nav-tabs"
import { Heading } from "@hazel/ui/heading"
import { SimpleTooltip } from "@hazel/ui/tooltip"
import { Container } from "@hazel/ui/container"
import { Icons } from "@/components/icons"
import { IconInfoCircle } from "@tabler/icons-react"
import { SourceIcon } from "@/components/source-icon"

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
						<SourceIcon slug={toolSlug} />

						<Heading className="pb-0" type={2}>
							Source Overview
						</Heading>

						<SimpleTooltip content="Source Overview">
							<IconInfoCircle />
						</SimpleTooltip>
					</div>
					<h4 className="text-lg text-muted-foreground">{source?.name}</h4>
				</div>

				<Link className={buttonVariants()} href={`/connection/new?source=${params.id}`}>
					Add to New Connection
				</Link>
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
