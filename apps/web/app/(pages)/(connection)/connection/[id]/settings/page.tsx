import { editConnectionAction } from "@/app/(pages)/(connection)/connection/[id]/settings/_actions"
import { EditConnectionForm } from "@/app/(pages)/(connection)/connection/[id]/settings/form"
import { auth } from "@/lib/auth"
import db from "@/lib/db"

const EditConnectionPage = async ({
	params,
}: {
	params: {
		id: string
	}
}) => {
	const { userId } = auth()

	const pSources = db.source.getMany({ customerId: userId })
	const pDestinations = db.destination.getMany({ customerId: userId })
	const pIntegrations = db.integration.getMany({ customerId: userId })
	const pConnection = db.connection.getOne({ publicId: params.id })

	const [sources, destinations, integrations, connection] = await Promise.all([pSources, pDestinations, pIntegrations, pConnection])

	return (
		<main className="p-4">
			<EditConnectionForm connection={connection as any} action={editConnectionAction} destinations={destinations} sources={sources} integrations={integrations}/>
		</main>
	)
}

export const runtime = "edge"

export default EditConnectionPage
