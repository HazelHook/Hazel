"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IntegrationToolSlug } from "db/src/drizzle/integrations/common"
import { INTEGRATIONS } from "db/src/drizzle/integrations/data"
import { Connection, Destination, Integration, Source } from "db/src/drizzle/schema"

import { getSeededProfileImageUrl } from "@/lib/utils"
import { Avatar, AvatarImage } from "@hazel/ui/avatar"

import { Badge } from "@hazel/ui/badge"
import { Cell, SortableHeader } from "@hazel/ui/data-table"
import { CheckTickIcon } from "@/components/icons/pika/checkTick"

export type Column = Source & {
	connections: Connection[]
	integration: Integration
}

export const columns: ColumnDef<Column>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => {
			return <SortableHeader name={"Name"} column={column} />
		},
		cell: ({ cell, row }) => {
			const id = row.original.publicId
			return (
				<Cell>
					<Avatar className="w-4 h-4 mr-2">
						<AvatarImage src={getSeededProfileImageUrl(id)} />
					</Avatar>
					{cell.getValue<string>()}
				</Cell>
			)
		},
	},
	{
		accessorKey: "integration",
		header: ({ column }) => {
			return <SortableHeader name={"Type"} column={column} />
		},
		cell: ({ cell }) => {
			const value = cell.getValue() as Integration
			if (!value) return <div className="flex flex-row justify-center">Custom</div>

			const integrationDefinition = INTEGRATIONS[value.tool as IntegrationToolSlug]

			return (
				<Cell>
					<img
						src={`/assets/integrations/${integrationDefinition.slug}.svg`}
						alt={integrationDefinition.slug}
						className="w-7 h-7"
					/>
				</Cell>
			)
		},
	},
	{
		accessorKey: "connections",
		header: "Destination",
		cell: ({ cell }) => {
			const connections = cell.getValue() as (Connection & {
				destination: Destination
			})[]

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
	},
	{
		accessorKey: "group",
		header: ({ column }) => {
			return <SortableHeader name={"Group"} column={column} />
		},
		cell: ({ cell }) => {
			return (
				<Cell>
					<p>-</p>
				</Cell>
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
]
