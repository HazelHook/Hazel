import { auth } from "@/lib/auth"
import { db } from "@hazel/db"
import { AddIcon, AutomationIcon, InfoCircleIcon, Settings02Icon, TimerIcon } from "@hazel/icons"
import { Button, buttonVariants } from "@hazel/ui/button"
import { Container } from "@hazel/ui/container"
import Heading from "@hazel/ui/heading"
import { SimpleTooltip } from "@hazel/ui/tooltip"
import Link from "next/link"
import { SourceCard } from "./components/source-card"
import { DestinationCard } from "./components/destination-card"
import { ConnectionPath } from "./components/connection-path"

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
					<SimpleTooltip content="True">
						<InfoCircleIcon />
					</SimpleTooltip>
				</div>
				<Link href="/connection/new" className={buttonVariants()}>
					<AddIcon className="mr-2" />
					New Connection
				</Link>
			</div>

			{connections.map(({ source, name, publicId, destination, delay, retryType }) => (
				<div className={"flex group justify-between items-center"} key={publicId}>
					<SourceCard name={source.name} id={source.publicId} />
					<ConnectionPath name={name} id={publicId} delay={delay} retryType={retryType} />

					<DestinationCard name={destination.name} id={destination.publicId} />
				</div>
			))}
		</Container>
	)
}

export default WebhooksPage
