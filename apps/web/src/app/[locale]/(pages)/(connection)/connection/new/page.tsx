import { CreateConnectionForm } from "@/components/forms/connection/CreateConnectionForm"
import { auth } from "@/lib/auth"
import db from "@/lib/db"

import { createConnectionAction } from "@/server/actions/connections"

const NewConnectionPage = async () => {
	const { workspaceId } = await auth()

	const pSources = db.source.getMany({ workspaceId: workspaceId })
	const pDestinations = db.destination.getMany({ workspaceId: workspaceId })
	const pIntegrations = db.integration.getMany({ workspaceId: workspaceId })

	const [sources, destinations, integrations] = await Promise.all([pSources, pDestinations, pIntegrations])

	return (
		<main className="p-4">
			<CreateConnectionForm
				action={createConnectionAction}
				destinations={destinations}
				sources={sources}
				integrations={integrations}
			/>
		</main>
	)
}

// export const runtime = "edge"

export default NewConnectionPage
