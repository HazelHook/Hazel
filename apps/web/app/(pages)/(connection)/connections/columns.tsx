"use client"

import Link from "next/link"
import { Avatar } from "@radix-ui/react-avatar"
import { ColumnDef } from "@tanstack/react-table"
import { Connection, Destination, Source } from "db/src/drizzle/schema"

import { getSeededProfileImageUrl } from "@/lib/utils"
import { AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckTickIcon } from "@/components/icons/pika/checkTick"
import { Cell, SortableHeader } from "@/components/ui/data-table"
import { ConnectionDataRowType } from "@/app/(pages)/(connection)/connections/page"
import { deleteConnectionAction, updateConnectionAction } from "@/app/(pages)/(connection)/_actions"
import { ConnectionActions } from "@/app/(pages)/(connection)/_components/ConnectionActions"
import { Button } from "@/components/ui/button"

export type Column = Connection & {
	source: Source | null
	destination: Destination | null
}

export const columns: (
	deleteAction: typeof deleteConnectionAction,
	updateAction: typeof updateConnectionAction,
) => ColumnDef<ConnectionDataRowType>[] = (deleteAction, updateAction) => [
	{
		accessorKey: "name",
		header: ({ column }) => {
			return <SortableHeader name={"Name"} column={column} />
		},
		cell: ({ cell, row }) => (
			<Link prefetch={false} href={`/connection/${row.original.publicId}`} className="flex flex-row items-center">
				<Button variant="link">{cell.getValue<string>()}</Button>
			</Link>
		),
	},
	{
		accessorKey: "source",
		header: "Source",
		cell: ({ cell }) => {
			const source = cell.getValue() as Source

			return (
				<div className="flex flex-row gap-1">
					<Link href={`/source/${source.publicId}`}>
						<Badge variant="secondary">
							<Avatar className="w-3 h-3 mr-2">
								<AvatarImage src={getSeededProfileImageUrl(source.publicId)} />
							</Avatar>
							{source.name}
						</Badge>
					</Link>
				</div>
			)
		},
	},
	{
		accessorKey: "destination",
		header: "Destination",
		cell: ({ cell }) => {
			const destination = cell.getValue() as Destination

			return (
				<div className="flex flex-row gap-1">
					<Link href={`/destination/${destination.publicId}`}>
						<Badge variant="secondary">
							<Avatar className="w-3 h-3 mr-2">
								<AvatarImage src={getSeededProfileImageUrl(destination.publicId)} />
							</Avatar>
							{destination.name}
						</Badge>
					</Link>
				</div>
			)
		},
	},

	{
		accessorKey: "group",
		header: ({ column }) => {
			return <SortableHeader name={"Group"} column={column} />
		},
		cell: ({ cell }) => {
			return <Cell>-</Cell>
		},
	},
	{
		accessorKey: "id",
		header: "Status",
		cell: ({ cell }) => {
			// const destination = cell.getValue<Destination>()

			return (
				<Badge>
					<CheckTickIcon className="w-4 h-4 mr-2" />
				</Badge>
			)
		},
	},
	{
		id: "actions",
		header: () => <p className="text-right">Actions</p>,
		cell: ({ row }) => {
			const connection = row.original

			return <ConnectionActions data={connection} updateAction={updateAction} deleteAction={deleteAction} />
		},
	},
]
