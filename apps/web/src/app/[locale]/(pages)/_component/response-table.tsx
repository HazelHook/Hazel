"use client"

import { httpStatusCodes } from "@/lib/utils"

import { Destination, Integration, Source } from "@hazel/db"
import { TBResponse } from "@hazel/tinybird"
import { AdvancedDataTable } from "@hazel/ui/data-table"

import { responseColumns } from "./response-column"
import { LogInLeftIcon } from "@hazel/icons"

type ResponseTableProps = {
	data: TBResponse[]
	sources: (Source & {
		integration: Integration | null
	})[]
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
						label: (
							<div className="flex gap-2 justify-center">
								{source.integration ? (
									<img
										src={`/assets/integrations/${source.integration.tool}.svg`}
										alt={source.integration.tool}
										className="w-4 h-4"
									/>
								) : (
									<LogInLeftIcon className="w-4 h-4 text-muted-foreground" />
								)}

								<p>{source.name}</p>
							</div>
						),
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
