"use client"

import { ReactNode, useMemo, useState } from "react"
import { DataTablePagination } from "@hazel/ui/data-table-pagination"
import { Sheet, SheetContent } from "@hazel/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@hazel/ui/table"
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from "@tanstack/react-table"

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	maxItems: number
	renderSheet?: (data: TData) => React.ReactNode
}

export function DataTable<TData extends Record<string, any> & { id: string }, TValue>({
	columns,
	data,
	maxItems,
	renderSheet,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([])
	const [sheetId, setSheetId] = useState<string>()

	const selectedRequest = useMemo(() => data.find((datum) => datum.id === sheetId), [data, sheetId])

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: {
			sorting,
		},
	})

	const handleSheetOpen = (state: boolean) => {
		if (!state) {
			setSheetId(undefined)
		}
	}

	return (
		<div className="space-y-2">
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
								<TableRow
									className="cursor-pointer"
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									onClick={() => setSheetId(row.original.id)}
								>
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
			<DataTablePagination hasFilter table={table} maxCount={maxItems} />
			<Sheet open={!!sheetId} onOpenChange={handleSheetOpen}>
				<SheetContent>
					<div className="grid gap-4 py-4">{selectedRequest && renderSheet?.(selectedRequest)}</div>
				</SheetContent>
			</Sheet>
		</div>
	)
}