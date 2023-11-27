import { notFound } from "next/navigation"

import { auth } from "@/lib/auth"
import { getTableParams } from "@/lib/data-table-helpers"
import { getCachedDestination } from "@/lib/orm"
import { PromiseType } from "@/lib/ts/helpers"
import { httpStatusCodes } from "@/lib/utils"

import tiny from "@hazel/tinybird"
import { AdvancedDataTable } from "@hazel/ui/data-table"

import { columns } from "./column"

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
				<AdvancedDataTable
					searchableColumns={[
						{
							id: "response_id",
							title: "responses",
						},
					]}
					filterableColumns={[
						{
							id: "status",
							title: "Status",
							options: httpStatusCodes.map((status) => ({
								label: `${status.code} - ${status.name}`,
								value: `${status.code}`,
							})),
						},
					]}
					data={destinations.data}
					maxItems={destinations.rows_before_limit_at_least || destinations.data.length}
					columns={columns}
				/>
			</div>
		</div>
	)
}

// export const runtime = "edge"

export default EventsPage
