import "server-only"

import { updateConnectionAction } from "@/server/actions/connections"
import { auth } from "@/lib/auth"
import db from "@/lib/db"
import { UpdateConnectionForm } from "@/app/[locale]/(pages)/(connection)/connection/[id]/settings/form"

export interface SettingsProps {
	id: string
	isModal?: boolean
}

export const ConnectionSettingsPage = async ({ id, isModal }: SettingsProps) => {
	const { workspaceId } = await auth()

	const pSources = db.source.getMany({ workspaceId })
	const pDestinations = db.destination.getMany({ workspaceId })
	const pIntegrations = db.integration.getMany({ workspaceId })
	const pConnection = db.connection.getOne({ publicId: id })

	const [sources, destinations, integrations, connection] = await Promise.all([
		pSources,
		pDestinations,
		pIntegrations,
		pConnection,
	])

	return (
		<UpdateConnectionForm
			connection={connection as any}
			action={updateConnectionAction}
			destinations={destinations}
			sources={sources}
			integrations={integrations}
			isModal={isModal}
		/>
	)
}
