"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Destination } from "db/src/drizzle/schema"
import { Connection } from "reactflow"

import { getSeededProfileImageUrl } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDownIcon } from "@/components/icons/pika/arrowDown"
import { ArrowUpIcon } from "@/components/icons/pika/arrowUp"
import { CheckTickIcon } from "@/components/icons/pika/checkTick"

import { DestinationsActions } from "@/app/(pages)/(destination)/_components/DestinationsActions"
import { TRPCResponse, TRPC_ERROR_CODE_NUMBER } from "@trpc/server/rpc"
import { typeToFlattenedError } from "zod"
import { DestinationsDataRowType } from "@/app/(pages)/(destination)/destinations/page"
import Link from "next/link"
import { deleteDestinationAction, updateDestinationAction } from "@/app/(pages)/(destination)/_actions"

export const columns: (
	deleteAction: typeof deleteDestinationAction,
	updateAction: typeof updateDestinationAction,
) => ColumnDef<DestinationsDataRowType>[] = (deleteAction, updateAction) => [
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Name
					{column.getIsSorted() === "asc" ? (
						<ArrowUpIcon className="ml-2 h-4 w-4" />
					) : (
						<ArrowDownIcon className="ml-2 h-4 w-4" />
					)}
				</Button>
			)
		},
		cell: ({ cell, row }) => {
			return (
				<Link
					prefetch={false}
					href={`/destination/${row.original.publicId}`}
					className="flex flex-row items-center ml-4"
				>
					<Avatar className="w-4 h-4 mr-2">
						<AvatarImage src={getSeededProfileImageUrl(row.original.publicId)} />
					</Avatar>
					<Button variant="link">{cell.getValue<string>()}</Button>
				</Link>
			)
		},
	},
	{
		accessorKey: "group",
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Group
					{column.getIsSorted() === "asc" ? (
						<ArrowUpIcon className="ml-2 h-4 w-4" />
					) : (
						<ArrowDownIcon className="ml-2 h-4 w-4" />
					)}
				</Button>
			)
		},
		cell: ({ cell }) => {
			return <p className="ml-4">-</p>
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
		header: "Actions",
		cell: ({ row }) => {
			const destination = row.original

			return <DestinationsActions data={destination} updateAction={updateAction} deleteAction={deleteAction} />
		},
	},
]
