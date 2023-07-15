import { auth } from "@/lib/auth"
import { getCachedIntegrations } from "@/lib/orm"

import { createSourceAction } from "./_actions"
import { NewSourceForm } from "./form"

const NewSourcePage = async () => {
	const { userId } = auth()
	const integrations = await getCachedIntegrations({
		customerId: userId,
	})

	return (
		<main className="p-4">
			<NewSourceForm action={createSourceAction} integrations={integrations} />
		</main>
	)
}

export const runtime = "edge"

export default NewSourcePage
