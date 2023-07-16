"use client"

import { DataTable } from "@/components/ui/data-table"
import { deleteDestinationAction, updateDestinationAction } from "@/app/(pages)/(destination)/_actions"
import { columns } from "@/app/(pages)/(destination)/destinations/columns"
import { DestinationsDataRowType } from "@/app/(pages)/(destination)/destinations/page"

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
