import { notFound } from "next/navigation"

import { auth } from "@/lib/auth"
import { getCachedDestination } from "@/lib/orm"
import tiny from "@/lib/tiny"
import { PromiseType } from "@/lib/ts/helpers"
import { TableWrapper } from "@/app/[locale]/(pages)/(destination)/destination/[id]/events/table"
import { getTableParams } from "@/lib/data-table-helpers"

interface EventsPageProps {
	params: {
		id: string
	}
	searchParams: {
		[key: string]: string | string[] | undefined
	}
}

async function fetchData({
	workspace_id,
	destination_id,
	offset,
	limit,
}: {
	workspace_id: string
	destination_id: string
	limit: number
	offset: number
}) {
	const destinations = await tiny.response.get({
		workspace_id,
		destination_id,
		limit,
		offset,
	})

	return destinations
}

export type EventDataRowType = PromiseType<ReturnType<typeof fetchData>>["data"][number]

const EventsPage = async ({ params, searchParams }: EventsPageProps) => {
	const { workspaceId } = await auth()

	const destination = await getCachedDestination({ publicId: params.id })

	if (!destination) {
		notFound()
	}

	const { offset, limit } = getTableParams(searchParams)

	const destinations = await fetchData({
		workspace_id: workspaceId,
		destination_id: params.id,
		offset,
		limit,
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

// export const runtime = "edge"

export default EventsPage
