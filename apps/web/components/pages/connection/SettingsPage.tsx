import "server-only"

import { auth } from "@/lib/auth"
import db from "@/lib/db"
import { editConnectionAction } from "@/app/(pages)/(connection)/connection/[id]/settings/_actions"
import { UpdateConnectionForm } from "@/app/(pages)/(connection)/connection/[id]/settings/form"

export interface SettingsProps {
	id: string
	isModal?: boolean
}

export const ConnectionSettingsPage = async ({ id, isModal }: SettingsProps) => {
	const { userId } = auth()

	const pSources = db.source.getMany({ customerId: userId })
	const pDestinations = db.destination.getMany({ customerId: userId })
	const pIntegrations = db.integration.getMany({ customerId: userId })
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
			action={editConnectionAction}
			destinations={destinations}
			sources={sources}
			integrations={integrations}
			isModal={isModal}
		/>
	)
}
