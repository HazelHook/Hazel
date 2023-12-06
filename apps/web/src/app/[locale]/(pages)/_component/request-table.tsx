"use client"

import { retryRequestAction } from "@/server/actions/retry"

import { Destination, Integration, Source } from "@hazel/db"
import { TBRequest } from "@hazel/tinybird"
import { AdvancedDataTable } from "@hazel/ui/data-table"

import { requestColumns } from "./request-columns"
import { IconLogin } from "@tabler/icons-react"

type RequestTableProps = {
	data: TBRequest[]
	sources: (Source & { integration: Integration | null })[]
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
						label: (
							<div className="flex gap-2 justify-center">
								{source.integration ? (
									<img
										src={`/assets/integrations/${source.integration.tool}.svg`}
										alt={source.integration.tool}
										className="w-4 h-4"
									/>
								) : (
									<IconLogin className="w-4 h-4 text-muted-foreground" />
								)}

								<p>{source.name}</p>
							</div>
						),
						value: source.publicId,
					})),
				},
			]}
		/>
	)
}
