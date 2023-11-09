"use client"

import { SimpleDataTable } from "@hazel/ui/data-table"

import { deleteConnectionAction, pauseConnectionAction, updateConnectionAction } from "@/server/actions/connections"
import { columns } from "@/app/[locale]/(pages)/(connection)/connections/columns"
import { ConnectionDataRowType } from "@/app/[locale]/(pages)/(connection)/connections/page"

export const ConnectionTable = ({
	data,
	pauseAction,
	deleteAction,
}: {
	data: ConnectionDataRowType[]
	pauseAction: typeof pauseConnectionAction
	deleteAction: typeof deleteConnectionAction
}) => {
	return (
		<SimpleDataTable
			rootPath="/connection"
			disableRedirect
			columns={columns(deleteAction, pauseAction)}
			data={data}
		/>
	)
}
