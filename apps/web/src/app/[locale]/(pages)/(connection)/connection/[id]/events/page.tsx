import { notFound } from "next/navigation"

import { auth } from "@/lib/auth"
import { getCachedConnection } from "@/lib/orm"
import { AdvancedDataTable } from "@hazel/ui/data-table"

import { responseColumns } from "../../../../_component/response-column"
import { getTableParams } from "@/lib/data-table-helpers"
import { responseTableSearchParamsSchema } from "@/lib/validators/params"
import { httpStatusCodes } from "@/lib/utils"
import tiny from "@/lib/tiny"
import { db } from "@hazel/db"

interface EventsPageProps {
	params: {
		id: string
	}
	searchParams: {
		[key: string]: string | string[] | undefined
	}
}

const EventsPage = async ({ params, searchParams }: EventsPageProps) => {
	const { workspaceId } = await auth()

	const connection = await getCachedConnection({ publicId: params.id })

	if (!connection) {
		notFound()
	}

	// TODO: SSR SORTING IN TB

	const { sort, offset, limit, status, response_id } = getTableParams(searchParams, responseTableSearchParamsSchema)

	const { data, rows_before_limit_at_least } = await tiny.response.get({
		workspace_id: workspaceId,
		source_id: connection.source?.publicId,
		destination_id: connection.destination?.publicId,
		response_id: response_id,
		status: status,
		offset,
		limit,
	})

	const pSources = await db.source.getMany({
		workspaceId,
	})

	const pDestinations = await db.destination.getMany({
		workspaceId,
	})

	const [sources, destinations] = await Promise.all([pSources, pDestinations])

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
					columns={responseColumns(sources, destinations)}
					data={data}
					maxItems={rows_before_limit_at_least || data.length}
				/>
			</div>
		</div>
	)
}

export const runtime = "edge"

export default EventsPage
