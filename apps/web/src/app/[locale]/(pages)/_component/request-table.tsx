"use client"

import { retryRequestAction } from "@/server/actions/retry"

import { Destination, Source } from "@hazel/db"
import { TBRequest } from "@hazel/tinybird"
import { AdvancedDataTable } from "@hazel/ui/data-table"

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
			columns={requestColumns(sources, destinations, retryRequestAction) as any}
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
