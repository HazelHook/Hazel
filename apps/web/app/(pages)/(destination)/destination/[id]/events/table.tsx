"use client"

import { ReactNode } from "react"

import { CacheDestination } from "@/lib/orm"
import { DataTable } from "@/components/DataTable"
import { columns } from "@/app/(pages)/(destination)/destination/[id]/events/column"
import { EventDataRowType } from "@/app/(pages)/(destination)/destination/[id]/events/page"

export const TableWrapper = ({
	data,
	maxItems,
	destination,
}: {
	data: EventDataRowType[]
	maxItems: number
	destination: CacheDestination
}) => {
	return (
		<DataTable
			columns={columns}
			data={data}
			maxItems={maxItems}
		/>
	)
}

const ListItem = ({
	name,
	description,
}: {
	name: string
	description: ReactNode | string
}) => {
	return (
		<div className="flex flex-row justify-between max-w-[250px]">
			<p className="text-muted-foreground">{name}</p>
			<p>{description}</p>
		</div>
	)
}
