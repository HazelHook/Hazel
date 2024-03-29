"use client"

import { deleteConnectionAction, pauseConnectionAction } from "@/server/actions/connections"
import { columns } from "@/app/[locale]/(pages)/(connection)/connections/columns"
import { ConnectionDataRowType } from "@/app/[locale]/(pages)/(connection)/connections/page"

import { SimpleDataTable } from "@hazel/ui/data-table"

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
