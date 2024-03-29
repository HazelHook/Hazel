"use client"

import { ReactNode, useState } from "react"

import type { createOrganizationInvite } from "@/server/actions/organization-invite"
import { usePagination } from "@/lib/hooks/usePagination"
import { OrganizationInviteModal } from "@/components/modals/organization-invite-modal"

import { Button } from "@hazel/ui/button"
import { DataTablePagination } from "@hazel/ui/data-table"
import { Input } from "@hazel/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@hazel/ui/table"
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table"
import { IconX } from "@tabler/icons-react"

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
					onChange={(event: any) => {
						table.getColumn("name")?.setFilterValue(event.target.value)
					}}
					className="max-w-sm"
				/>
				<OrganizationInviteModal orgId={orgId} inviteAction={createInviteAction}>
					<Button>
						<IconX className="mr-2" />
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
											{header.isPlaceholder
												? null
												: (flexRender(
														header.column.columnDef.header,
														header.getContext(),
												  ) as ReactNode)}
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
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext()) as ReactNode}
										</TableCell>
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
			<DataTablePagination hasFilter maxCount={data.length} table={table} />
		</div>
	)
}
