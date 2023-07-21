import { notFound } from "next/navigation"

import { auth } from "@/lib/auth"
import { getCachedDestination } from "@/lib/orm"
import tiny from "@/lib/tiny"
import { PromiseType } from "@/lib/ts/helpers"
import { TableWrapper } from "@/app/(pages)/(destination)/destination/[id]/events/table"

interface EventsPageProps {
	params: {
		id: string
	}
}

async function fetchData({
	workspace_id,
	destination_id,
}: {
	workspace_id: string
	destination_id: string
}) {
	const destinations = await tiny.response.get({
		workspace_id,
		destination_id,
	})

	return destinations
}

export type EventDataRowType = PromiseType<ReturnType<typeof fetchData>>["data"][number]

const EventsPage = async ({ params }: EventsPageProps) => {
	const { userId } = auth()
	const destination = await getCachedDestination({ publicId: params.id })

	if (!destination) {
		notFound()
	}

	const destinations = await fetchData({
		workspace_id: userId,
		destination_id: params.id,
	})

	return (
		<div>
			<div className="w-full">
				<TableWrapper
					data={destinations.data}
					maxItems={destinations.rows_before_limit_at_least || destinations.data.length}
				/>
			</div>
		</div>
	)
}

export const runtime = "edge"

export default EventsPage
