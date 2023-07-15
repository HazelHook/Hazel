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
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { EditPencilIcon } from "@/components/icons/pika/editPencil"
import { NewIntegrationForm } from "@/app/(pages)/(integration)/_components/NewIntegrationForm"
import { INTEGRATIONS } from "db/src/drizzle/integrations/data"
import { IntegrationTool } from "db/src/drizzle/integrations/common"
import { UpdateIntegrationForm } from "@/app/(pages)/(integration)/_components/UpdateIntegrationForm"

export const columns: (deleteIntegration: UseTRPCActionResult<any>, router: any) => ColumnDef<IntegrationToolColumn>[] =
	(deleteIntegration, router) => [
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
			cell: ({ cell, row }) => {
				const integration = row.original
				const tool = integration.tool as keyof typeof INTEGRATIONS
				return (
					<div className="flex justify-end">
						<Dialog>
							<DialogTrigger asChild>
								<Button variant="ghost">
									<EditPencilIcon className="h-4 w-4" />
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-sm">
								<UpdateIntegrationForm integration={INTEGRATIONS[tool]} onClose={() => {}} />
								<DialogFooter>
									<DialogClose asChild>
										<Button variant="outline">Cancel</Button>
									</DialogClose>
									<Button
										type="submit"
										onClick={() => {
											toast.promise(async () => {}, {
												loading: "Update Integration...",
												success: "Integration Successfully Updated",
												error: "There was an error updating your Integration. Please try again or contact us.",
											})
										}}
									>
										Update
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
						<Dialog>
							<DialogTrigger asChild>
								<Button variant="ghost" disabled={integration.source.length > 0}>
									<DeleteDustbinIcon className="h-4 w-4" />
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-sm">
								<DialogHeader>
									<DialogTitle>Are you sure you want to delete this Integration?</DialogTitle>
									<DialogDescription>
										This action cannot be undone. Are you sure you want to permanently delete this integration forever?
									</DialogDescription>
								</DialogHeader>
								<DialogFooter>
									<DialogClose asChild>
										<Button>Cancel</Button>
									</DialogClose>
									<Button
										type="submit"
										onClick={() => {
											toast.promise(deleteIntegration.mutateAsync(cell.getValue()), {
												loading: "Deleting Integration...",
												success: "Integration Successfully Integrated",
												error: "There was an error deleting your Integration. Please try again or contact us.",
											})
										}}
										variant="destructive"
									>
										Delete
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				)
			},
		},
	]
