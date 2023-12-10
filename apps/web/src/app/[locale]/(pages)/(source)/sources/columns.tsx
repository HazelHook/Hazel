"use client"

import { getSeededProfileImageUrl } from "@/lib/utils"

import { Connection, Destination, Integration, Source } from "@hazel/db"
import { Avatar, AvatarImage } from "@hazel/ui/avatar"
import { Badge } from "@hazel/ui/badge"
import { Button } from "@hazel/ui/button"
import { SortableHeader } from "@hazel/ui/data-table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@hazel/ui/tooltip"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { SourceActions } from "./source-actions"
import { deleteSourceAction } from "@/server/actions/source"
import { Icons } from "@/components/icons"
import { IconCheck } from "@tabler/icons-react"

export type Column = Source & {
	connections: (Connection & {
		destination: Destination
	})[]
	integration: Integration | null
}

const columnHelper = createColumnHelper<Column>()

export const columns = [
	columnHelper.accessor("name", {
		header: ({ column }) => {
			return <SortableHeader name={"Name"} column={column} />
		},
		cell: ({ cell, row }) => {
			return (
				<Link prefetch={false} href={`/source/${row.original.publicId}`} className="flex flex-row items-center">
					<Tooltip delayDuration={200}>
						<TooltipTrigger>
							<Button className="gap-2" variant="ghost">
								{row.original.integration ? (
									<img
										src={`/assets/integrations/${row.original.integration.tool}.svg`}
										alt={row.original.integration.tool}
										className="w-6 h-6"
									/>
								) : (
									<Icons.Source className="w-4 h-4 text-muted-foreground" />
								)}
								{cell.getValue<string>()}
							</Button>
						</TooltipTrigger>
						<TooltipContent>View Detailed</TooltipContent>
					</Tooltip>
				</Link>
			)
		},
	}),
	columnHelper.accessor("connections", {
		id: "destinations",
		header: "Destination",
		cell: ({ cell }) => {
			const connections = cell.getValue()

			return (
				<div className="flex flex-row gap-1">
					{/* <div className="bg-secondary rounded-xl text-ellipsis w-fit min-w-[24px] h-6 flex justify-center items-center">
						<p>{connections.length}</p>
					</div> */}
					<div className="flex flex-row gap-1 flex-wrap">
						{connections.map((conn) => (
							<Badge variant="outline" key={`badge-${conn.publicId}`}>
								<Avatar className="w-3 h-3 mr-2">
									<AvatarImage src={getSeededProfileImageUrl(conn.publicId)} />
								</Avatar>
								{conn.destination.name}
							</Badge>
						))}
					</div>
				</div>
			)
		},
	}),
	columnHelper.accessor("connections", {
		header: "Status",
		cell: ({ cell }) => {
			const connections = cell.getValue()

			return (
				<Badge>
					<IconCheck className="w-4 h-4 mr-2" />
					<p>{connections.length}</p>
				</Badge>
			)
		},
	}),
	columnHelper.display({
		id: "actions",
		cell: ({ row }) => {
			return <SourceActions data={row.original} deleteAction={deleteSourceAction} />
		},
	}),
] as ColumnDef<Column>[]
