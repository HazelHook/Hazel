"use client"

import { TBResponse } from "@hazel/tinybird"
import { AdvancedDataTable } from "@hazel/ui/data-table"
import { responseColumns } from "./response-column"
import { httpStatusCodes } from "@/lib/utils"
import { Destination, Source } from "@hazel/db"

type ResponseTableProps = {
	data: TBResponse[]
	sources: Source[]
	destinations: Destination[]
	maxItems: number
}

export const ResponseTable = ({ data, sources, destinations, maxItems }: ResponseTableProps) => {
	return (
		<AdvancedDataTable
			maxItems={maxItems}
			data={data}
			columns={responseColumns(sources, destinations)}
			disableViewToggle
			searchableColumns={[
				{
					id: "response_id",
					title: "ID",
				},
			]}
			filterableColumns={[
				{
					id: "source_id",
					title: "Source",
					options: sources.map((source) => ({
						label: source.name,
						value: source.publicId,
					})),
				},
				{
					id: "destination_id",
					title: "Destination",
					options: destinations.map((dest) => ({
						label: dest.name,
						value: dest.publicId,
					})),
				},
				{
					id: "success",
					title: "Success",
					options: [
						{ label: "Success", value: "true" },
						{ label: "Error", value: "false" },
					],
				},
				{
					id: "status",
					title: "Status Code",
					options: httpStatusCodes.map((status) => ({
						label: `${status.code} - ${status.name}`,
						value: `${status.code}`,
					})),
				},
			]}
		/>
	)
}
