"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { Destination } from "db/src/drizzle/schema"
import { Connection } from "reactflow"

import { getSeededProfileImageUrl } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { SortableHeader } from "@/components/ui/data-table"
import { CheckTickIcon } from "@/components/icons/pika/checkTick"
import { deleteDestinationAction, updateDestinationAction } from "@/app/(pages)/(destination)/_actions"
import { DestinationsActions } from "@/app/(pages)/(destination)/_components/DestinationsActions"
import { DestinationsDataRowType } from "@/app/(pages)/(destination)/destinations/page"

export const columns: (
	deleteAction: typeof deleteDestinationAction,
	updateAction: typeof updateDestinationAction,
) => ColumnDef<DestinationsDataRowType>[] = (deleteAction, updateAction) => [
	{
		accessorKey: "name",
		header: ({ column }) => {
			return <SortableHeader name={"Name"} column={column} />
		},
		cell: ({ cell, row }) => {
			return (
				<Link
					prefetch={false}
					href={`/destination/${row.original.publicId}`}
					className={buttonVariants({
						variant: "ghost",
						className: "flex flex-row gap-2 items-center",
					})}
				>
					<Avatar className="w-4 h-4">
						<AvatarImage src={getSeededProfileImageUrl(row.original.publicId)} />
					</Avatar>
					{cell.getValue<string>()}
				</Link>
			)
		},
	},
	{
		accessorKey: "connections",
		header: "Connected Sources",
		cell: ({ row }) => {
			const connections = row.original.connections

			return (
				<div className="flex flex-row gap-1">
					{connections.map((connection) => (
						<Link key={connection.sourceId} href={`/source/${connection.source.publicId}`}>
							<Badge variant="secondary">
								<Avatar className="w-3 h-3 mr-2">
									<AvatarImage src={getSeededProfileImageUrl(connection.source.publicId)} />
								</Avatar>
								{connection.source.name}
							</Badge>
						</Link>
					))}
				</div>
			)
		},
	},
	{
		accessorKey: "connections",
		header: "Status",
		cell: ({ cell }) => {
			const connections = cell.getValue() as (Connection & {
				destination: Destination
			})[]

			return (
				<Badge>
					<CheckTickIcon className="w-4 h-4 mr-2" />
					<p>{connections.length}</p>
				</Badge>
			)
		},
	},
	{
		id: "actions",
		header: () => <p className="text-right">Actions</p>,
		cell: ({ row }) => {
			const destination = row.original

			return <DestinationsActions data={destination} updateAction={updateAction} deleteAction={deleteAction} />
		},
	},
]
