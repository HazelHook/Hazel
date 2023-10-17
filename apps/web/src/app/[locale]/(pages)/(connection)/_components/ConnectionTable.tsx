"use client"

import { DataTable } from "@hazel/ui/data-table"
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
	return <DataTable rootPath="/connection" disableRedirect columns={columns(deleteAction, pauseAction)} data={data} />
}
