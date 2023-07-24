import { notFound } from "next/navigation"

import { auth } from "@/lib/auth"
import db from "@/lib/db"
import { getCachedSource } from "@/lib/orm"
import { editSourceAction } from "@/server/actions/source"
import { EditSourceForm } from "@/app/(pages)/(source)/source/[id]/settings/form"

interface EventsPageProps {
	params: {
		id: string
	}
}

const SettingsPage = async ({ params }: EventsPageProps) => {
	const source = await getCachedSource({ publicId: params.id })

	if (!source) {
		notFound()
	}

	const { workspaceId } = await auth()

	const integrations = await db.integration.getMany({
		workspaceId: workspaceId,
	})

	return (
		<div>
			<div className="w-full">
				<EditSourceForm action={editSourceAction} integrations={integrations} source={source} />
			</div>
		</div>
	)
}

export const runtime = "edge"

export default SettingsPage
