import { type ReactNode } from "react"
import Link from "next/link"

import { getCachedDestination } from "@/lib/orm"

import { buttonVariants } from "@hazel/ui/button"
import { LinkTab } from "@hazel/ui/link-tabs"
import { NavTabs } from "@hazel/ui/nav-tabs"
import { Heading } from "@hazel/ui/heading"
import { SimpleTooltip } from "@hazel/ui/tooltip"
import { IconInfoCircle } from "@tabler/icons-react"
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
	const destination = await getCachedDestination({ publicId: params.id })

	return (
		<Container>
			<div className="flex flex-row justify-between mb-4">
				<div className="space-y-2">
					<div className="flex gap-2 items-center">
						<Heading className="pb-0" type={2}>
							Destination Overview
						</Heading>

						<SimpleTooltip content="Source Overview">
							<IconInfoCircle />
						</SimpleTooltip>
					</div>
					<Heading type={3}>
						{destination.name} <span className="text-muted-foreground text-base">({destination.key})</span>
					</Heading>
				</div>

				<Link className={buttonVariants()} href={`/connection/new?destination=${params.id}`}>
					Add to New Connection
				</Link>
			</div>
			<div className="space-y-4">
				<NavTabs>
					<LinkTab href={`/destination/${params.id}`}>Overview</LinkTab>
					<LinkTab href={`/destination/${params.id}/settings`}>Settings</LinkTab>
				</NavTabs>
				{children}
			</div>
		</Container>
	)
}

export default ConnectionLayout
