import { createConnectionAction } from "@/server/actions/connections"
import { auth } from "@/lib/auth"
import { db } from "@hazel/db"
import { NewConnectionForm } from "./new-connection-form"
import { Container } from "@hazel/ui/container"

const NewConnectionPage = async () => {
	const { workspaceId } = await auth()

	const pSources = db.source.getMany({ workspaceId: workspaceId })
	const pDestinations = db.destination.getMany({ workspaceId: workspaceId })
	const pIntegrations = db.integration.getMany({ workspaceId: workspaceId })

	const [sources, destinations, integrations] = await Promise.all([pSources, pDestinations, pIntegrations])

	return (
		<Container className="space-y-0">
			<NewConnectionForm
				action={createConnectionAction}
				destinations={destinations}
				sources={sources}
				integrations={integrations}
			/>
		</Container>
	)
}

// export const runtime = "edge"

export default NewConnectionPage
