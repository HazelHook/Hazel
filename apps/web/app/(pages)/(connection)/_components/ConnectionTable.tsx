"use client"

import { DataTable } from "@/components/ui/data-table"
import { deleteConnectionAction, updateConnectionAction } from "@/app/(pages)/(connection)/_actions"
import { ConnectionDataRowType } from "@/app/(pages)/(connection)/connections/page"
import { columns } from "@/app/(pages)/(connection)/connections/columns"

export const ConnectionTable = ({
	data,
	updateAction,
	deleteAction,
}: {
	data: ConnectionDataRowType[]
	updateAction: typeof updateConnectionAction
	deleteAction: typeof deleteConnectionAction
}) => {
	return <DataTable rootPath="/connection" disableRedirect columns={columns(deleteAction)} data={data} />
}
