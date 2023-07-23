"use client"

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { DataTablePagination } from "@/components/ui/data-table-pagination"
import { Button } from "@/components/ui/button"
import { AddIcon } from "@/components/icons/pika/add"
import { usePagination } from "@/lib/hooks/usePagination"
import { OrganizationInviteModal } from "@/components/modals/OrganizationInviteModal"
import { createOrganizationInvite } from "../_actions"

interface DataTableProps<TData, TValue> {
	orgId: number
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	createInviteAction: typeof createOrganizationInvite
}

export function DataTable<TData, TValue>({ columns, data, orgId, createInviteAction }: DataTableProps<TData, TValue>) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

	const { state, setPagination } = usePagination()

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: setPagination,
		state: {
			columnFilters,
			pagination: state,
		},
	})

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between py-4">
				<Input
					placeholder="Filter members..."
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
					className="max-w-sm"
				/>
				<OrganizationInviteModal orgId={orgId} inviteAction={createInviteAction}>
					<Button>
						<AddIcon className="mr-2" />
						Add Member
					</Button>
				</OrganizationInviteModal>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination hasFilter table={table} />
		</div>
	)
}
