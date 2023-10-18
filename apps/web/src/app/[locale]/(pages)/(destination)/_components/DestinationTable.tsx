"use client"

import { DataTable } from "@hazel/ui/data-table"

import { deleteDestinationAction, updateDestinationAction } from "@/server/actions/destination"
import { columns } from "@/app/[locale]/(pages)/(destination)/destinations/columns"
import { DestinationsDataRowType } from "@/app/[locale]/(pages)/(destination)/destinations/page"

export const DestinationTable = ({
	destination,
	updateAction,
	deleteAction,
}: {
	destination: DestinationsDataRowType[]
	updateAction: typeof updateDestinationAction
	deleteAction: typeof deleteDestinationAction
}) => {
	return (
		<DataTable
			rootPath="/destination"
			disableRedirect
			columns={columns(deleteAction, updateAction)}
			data={destination as any}
		/>
	)
}
