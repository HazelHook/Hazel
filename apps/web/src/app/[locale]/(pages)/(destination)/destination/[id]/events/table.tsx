"use client"

import { DataTable } from "@//components/DataTable"
import { columns } from "@//app/[locale]/(pages)/(destination)/destination/[id]/events/column"
import { EventDataRowType } from "@//app/[locale]/(pages)/(destination)/destination/[id]/events/page"

export const TableWrapper = ({
	data,
	maxItems,
}: {
	data: EventDataRowType[]
	maxItems: number
}) => {
	return <DataTable columns={columns} data={data} maxItems={maxItems} />
}
