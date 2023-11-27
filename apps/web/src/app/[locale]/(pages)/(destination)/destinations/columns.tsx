"use client"

import Link from "next/link"

import type { deleteDestinationAction, updateDestinationAction } from "@/server/actions/destination"
import { getSeededProfileImageUrl } from "@/lib/utils"
import { DestinationsActions } from "@/app/[locale]/(pages)/(destination)/_components/DestinationsActions"
import { DestinationsDataRowType } from "@/app/[locale]/(pages)/(destination)/destinations/page"

import { Connection, Destination } from "@hazel/db/schema"
import { CheckTickIcon } from "@hazel/icons"
import { Avatar, AvatarImage } from "@hazel/ui/avatar"
import { Badge } from "@hazel/ui/badge"
import { buttonVariants } from "@hazel/ui/button"
import { SortableHeader } from "@hazel/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"

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
