"use client"

import { DataTable } from "@/components/ui/data-table"
import {
	deleteConnectionAction,
	pauseConnectionAction,
	updateConnectionAction,
} from "@/app/(pages)/(connection)/_actions"
import { columns } from "@/app/(pages)/(connection)/connections/columns"
import { ConnectionDataRowType } from "@/app/(pages)/(connection)/connections/page"

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
