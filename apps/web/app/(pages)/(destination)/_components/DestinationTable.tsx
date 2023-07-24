"use client"

import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/app/(pages)/(destination)/destinations/columns"
import { DestinationsDataRowType } from "@/app/(pages)/(destination)/destinations/page"
import { deleteDestinationAction, updateDestinationAction } from "@/server/actions/destination"

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
