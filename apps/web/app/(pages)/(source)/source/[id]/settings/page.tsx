import { notFound } from "next/navigation"

import { auth } from "@/lib/auth"
import { getCachedSource } from "@/lib/orm"
import db from "@/lib/db"
import { EditSourceForm } from "@/app/(pages)/(source)/source/[id]/settings/form"
import { editSourceAction } from "@/app/(pages)/(source)/source/[id]/settings/_actions"

interface EventsPageProps {
    params: {
        id: string
    }
}

const SettingsPage = async ({ params }: EventsPageProps) => {
	const { userId } = auth()
	const source = await getCachedSource({ publicId: params.id })
    const integrations = await db.integration.getMany({
        customerId: userId
    })

	if (!source) {
		notFound()
	}

	return (
		<div>
			<div className="w-full">
                <EditSourceForm
                    action={editSourceAction}
                    integrations={integrations}
					source={source}
                />
			</div>
		</div>
	)
}

export const runtime = "edge"

export default SettingsPage
