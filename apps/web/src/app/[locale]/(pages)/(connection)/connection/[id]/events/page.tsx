import { notFound } from "next/navigation"

import { auth } from "@/lib/auth"
import { getCachedConnection } from "@/lib/orm"
import { AdvancedDataTable, DataTable } from "@hazel/ui/data-table"

import { columns } from "./column"
import { getTableParams } from "@/lib/data-table-helpers"
import { responseTableSearchParamsSchema } from "@/lib/validators/params"
import { httpStatusCodes } from "@/lib/utils"
import tiny from "@/lib/tiny"

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

	const { sort, offset, limit, status, id } = getTableParams(searchParams, responseTableSearchParamsSchema)

	const { data, rows_before_limit_at_least } = await tiny.response.get({
		workspace_id: workspaceId,
		source_id: connection.source?.publicId,
		destination_id: connection.destination?.publicId,
		status: status,
		offset,
		limit,
	})

	return (
		<div>
			<div className="w-full">
				<AdvancedDataTable
					searchableColumns={[
						{
							id: "id",
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
					columns={columns}
					data={data}
					maxItems={rows_before_limit_at_least || data.length}
				/>
			</div>
		</div>
	)
}

export const runtime = "edge"

export default EventsPage
