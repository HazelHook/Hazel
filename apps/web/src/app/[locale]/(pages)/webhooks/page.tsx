import Link from "next/link"

import { auth } from "@/lib/auth"

import { db } from "@hazel/db"
import { buttonVariants } from "@hazel/ui/button"
import { Container } from "@hazel/ui/container"
import { Heading } from "@hazel/ui/heading"
import { SimpleTooltip } from "@hazel/ui/tooltip"

import { ConnectionPath } from "./components/connection-path"
import { DestinationCard } from "./components/destination-card"
import { SourceCard } from "./components/source-card"
import { IconInfoCircle, IconPlus } from "@tabler/icons-react"

const WebhooksPage = async () => {
	const { workspaceId } = await auth()

	const connections = await db.connection.getMany({ workspaceId })

	return (
		<Container>
			<div className="flex flex-row justify-between">
				<div className="flex gap-2 items-center">
					<Heading className="pb-0" type={2}>
						Webhooks
					</Heading>
					<SimpleTooltip content="Webhook Connection Overview">
						<IconInfoCircle />
					</SimpleTooltip>
				</div>
				<Link href="/connection/new" className={buttonVariants()}>
					<IconPlus className="mr-2" />
					New Connection
				</Link>
			</div>

			{connections.map(({ source, name, publicId, destination, delay, retryType, retryDelay, retyCount }) => (
				<div className={"flex group justify-between items-center"} key={publicId}>
					<SourceCard source={source} />
					<ConnectionPath
						name={name}
						id={publicId}
						delay={delay}
						retryType={retryType}
						retryDelay={retryDelay}
						retryCount={retyCount}
					/>

					<DestinationCard destination={destination} />
				</div>
			))}
		</Container>
	)
}

export const runtime = "edge"

export default WebhooksPage
