"use client"

import { deleteDestinationAction, updateDestinationAction } from "@/server/actions/destination"
import { columns } from "@/app/[locale]/(pages)/(destination)/destinations/columns"
import { DestinationsDataRowType } from "@/app/[locale]/(pages)/(destination)/destinations/page"

import { SimpleDataTable } from "@hazel/ui/data-table"

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
		<SimpleDataTable
			rootPath="/destination"
			disableRedirect
			columns={columns(deleteAction, updateAction)}
			data={destination as any}
		/>
	)
}
