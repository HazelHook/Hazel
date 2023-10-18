"use client"

import { Badge } from "@hazel/ui/badge"
import { SortableHeader } from "@hazel/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { INTEGRATIONS } from "db/src/drizzle/integrations/data"

import type { deleteIntegrationAction, updateIntegrationAction } from "@/server/actions/integrations"
import { CheckTickIcon } from "@/components/icons/pika/checkTick"
import { IntegrationsActions } from "@/app/[locale]/(pages)/(integration)/_components/IntegrationsActions"
import { IntegrationToolColumn } from "@/app/[locale]/(pages)/(integration)/integrations/page"

export const columns: (
	deleteAction: typeof deleteIntegrationAction,
	updateAction: typeof updateIntegrationAction,
) => ColumnDef<IntegrationToolColumn>[] = (deleteAction, updateAction) => [
	{
		accessorKey: "tool",
		header: "Tool",
		cell: ({ cell }) => {
			const tool = cell.getValue() as any

			return (
				<div className="flex flex-row items-center gap-2">
					<img src={`/assets/integrations/${tool}.svg`} alt={tool} className="w-7 h-7" />
				</div>
			)
		},
	},
	{
		accessorKey: "name",
		header: ({ column }) => {
			return <SortableHeader name={"Name"} column={column} />
		},
		cell: ({ cell }) => {
			const name = cell.getValue() as any

			return (
				<div>
					<p>{name}</p>
				</div>
			)
		},
	},
	{
		accessorKey: "source",
		header: "Sources",
		cell: ({ cell }) => {
			const sources = (cell.getValue() as any[]) ?? []

			return (
				<Badge>
					<CheckTickIcon className="w-4 h-4 mr-2" />
					<p>{sources.length}</p>
				</Badge>
			)
		},
	},
	{
		accessorKey: "publicId",
		header: () => <p className="text-right">Actions</p>,
		cell: ({ row }) => {
			const integration = row.original
			const tool = integration.tool as keyof typeof INTEGRATIONS
			return (
				<IntegrationsActions
					tool={tool}
					numOfSources={integration.source.length}
					integrationId={integration.publicId}
					updateAction={updateAction}
					deleteAction={deleteAction}
					data={integration}
				/>
			)
		},
	},
]
