"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDownSquareIcon } from "@/components/icons/pika/arrowDownSquare"
import { ArrowUpSquareIcon } from "@/components/icons/pika/arrowUpSquare"
import { CheckTickIcon } from "@/components/icons/pika/checkTick"
import { IntegrationToolColumn } from "@/app/(pages)/(integration)/integrations/page"
import { DeleteDustbinIcon } from "@/components/icons/pika/deleteDustbin"
import { UseTRPCActionResult } from "@trpc/next/app-dir/client"
 

export const columns: (deleteIntegration: UseTRPCActionResult<any>, router: any) => ColumnDef<IntegrationToolColumn>[] = (
	deleteIntegration,
	router
) => [
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
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Name
					{column.getIsSorted() === "asc" ? (
						<ArrowUpSquareIcon className="ml-2 h-4 w-4" />
					) : (
						<ArrowDownSquareIcon className="ml-2 h-4 w-4" />
					)}
				</Button>
			)
		},
		cell: ({ cell }) => {
			const name = cell.getValue() as any

			return (
				<div className="ml-4">
					<p>{name}</p>
				</div>
			)
		},
	},
	{
		accessorKey: "sources",
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
		header: "",
		cell: ({ cell }) => {
			return (
				<div className="float-right">
					<Button
						variant="ghost"
						onClick={() => {
							deleteIntegration.mutate(cell.getValue())
							router.refresh()
						}}
					>
						<DeleteDustbinIcon className="h-4 w-4" />
					</Button>
				</div>
			)
		},
	},
]
