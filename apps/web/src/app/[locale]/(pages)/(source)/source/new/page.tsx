import { createSourceAction } from "@/server/actions/source"
import { auth } from "@/lib/auth"
import { getCachedIntegrations } from "@/lib/orm"
import { CreateSourceForm } from "@/components/forms/source/create-source-form"

const NewSourcePage = async () => {
	const { workspaceId } = await auth()
	const integrations = await getCachedIntegrations({
		workspaceId: workspaceId,
	})

	return (
		<main className="p-4">
			<CreateSourceForm action={createSourceAction} integrations={integrations} />
		</main>
	)
}

// export const runtime = "edge"

export default NewSourcePage
