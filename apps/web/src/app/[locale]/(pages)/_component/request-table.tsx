"use client"

import { TBRequest } from "@hazel/tinybird"
import { AdvancedDataTable } from "@hazel/ui/data-table"
import { httpStatusCodes } from "@/lib/utils"
import { Destination, Source } from "@hazel/db"
import { requestColumns } from "./request-columns"

type RequestTableProps = {
	data: TBRequest[]
	sources: Source[]
	destinations: Destination[]
	maxItems: number
}

export const RequestTable = ({ data, sources, destinations, maxItems }: RequestTableProps) => {
	return (
		<AdvancedDataTable
			maxItems={maxItems}
			data={data}
			columns={requestColumns(sources, destinations) as any}
			disableViewToggle
			searchableColumns={[{ id: "request_id", title: "for ID" }]}
			filterableColumns={[
				{
					id: "source_id",
					title: "Source",
					options: sources.map((source) => ({
						label: source.name,
						value: source.publicId,
					})),
				},
			]}
		/>
	)
}
