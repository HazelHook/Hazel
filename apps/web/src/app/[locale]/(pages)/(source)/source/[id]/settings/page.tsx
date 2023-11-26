import { notFound } from "next/navigation"
import { db } from "@hazel/db"

import { updateSourceAction } from "@/server/actions/source"
import { auth } from "@/lib/auth"
import { getCachedSource } from "@/lib/orm"
import { UpdateSourceForm } from "@/components/forms/source/update-source-form"

interface EventsPageProps {
	params: {
		id: string
	}
}

const SettingsPage = async ({ params }: EventsPageProps) => {
	const { workspaceId } = await auth()

	const source = await getCachedSource({ publicId: params.id, workspaceId })

	if (!source) {
		notFound()
	}

	const integrations = await db.integration.getMany({
		workspaceId: workspaceId,
	})

	return (
		<div>
			<div className="w-full">
				<UpdateSourceForm action={updateSourceAction} integrations={integrations} source={source} />
			</div>
		</div>
	)
}

export const runtime = "edge"

export default SettingsPage
