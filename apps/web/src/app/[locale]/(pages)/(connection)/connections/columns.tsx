"use client"

import Link from "next/link"
import { Avatar, AvatarImage } from "@hazel/ui/avatar"
import { ColumnDef } from "@tanstack/react-table"
import { Connection, Destination, Source } from "db/src/drizzle/schema"

import { getSeededProfileImageUrl } from "@/lib/utils"
import { Badge } from "@hazel/ui/badge"
import { Button } from "@hazel/ui/button"
import { Cell, SortableHeader } from "@hazel/ui/data-table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@hazel/ui/tooltip"
import { CheckTickIcon } from "@/components/icons/pika/checkTick"
import { EyeOpenIcon } from "@/components/icons/pika/eyeOpen"
import { deleteConnectionAction, pauseConnectionAction } from "@/server/actions/connections"
import { ConnectionActions } from "@/app/[locale]/(pages)/(connection)/_components/ConnectionActions"
import { ConnectionDataRowType } from "@/app/[locale]/(pages)/(connection)/connections/page"

export type Column = Connection & {
	source: Source | null
	destination: Destination | null
}

export const columns: (
	deleteAction: typeof deleteConnectionAction,
	pauseAction: typeof pauseConnectionAction,
) => ColumnDef<ConnectionDataRowType>[] = (deleteAction, pauseAction) => [
	{
		accessorKey: "name",
		header: ({ column }) => {
			return <SortableHeader name={"Name"} column={column} />
		},
		cell: ({ cell, row }) => (
			<Link prefetch={false} href={`/connection/${row.original.publicId}`} className="flex flex-row items-center">
				<Tooltip delayDuration={200}>
					<TooltipTrigger>
						<Button variant="ghost">
							<EyeOpenIcon className="mr-2" />
							{cell.getValue<string>()}
						</Button>
					</TooltipTrigger>
					<TooltipContent>View Detailed</TooltipContent>
				</Tooltip>
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
		accessorKey: "enabled",
		header: ({ column }) => {
			return <SortableHeader name={"Active"} column={column} />
		},
		cell: ({ cell }) => {
			const enabled = cell.getValue() as boolean
			return <Cell>{enabled ? "Running" : "Paused"}</Cell>
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

			return <ConnectionActions data={connection} deleteAction={deleteAction} pauseAction={pauseAction} />
		},
	},
]
