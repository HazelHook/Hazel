"use client"

import { useMemo, useState } from "react"
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from "@tanstack/react-table"

import { DataTablePagination } from "@/components/ui/data-table-pagination"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Request } from "./column"

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<Request, TValue>[]
	data: Response[]
	maxItems: number
}

export function DataTable<TData, TValue>({ columns, data, maxItems }: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([])
	const [sheetId, setSheetId] = useState<string>()

	const selectedReq = useMemo(() => data.find((datum) => datum.id === sheetId), [data, sheetId])

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
								<TableRow
									className="cursor-pointer"
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									onClick={() => setSheetId((row.original as any).request_id)}
								>
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
			<DataTablePagination hasFilter table={table} maxCount={maxItems} />
			<Sheet open={!!sheetId} onOpenChange={handleSheetOpen}>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Request Overview</SheetTitle>
						<SheetDescription>{sheetId}</SheetDescription>
					</SheetHeader>
					<div className="grid gap-4 py-4">
						<div className="space-y-2">
							<p>Headers</p>
							{selectedReq?.headers}
						</div>
						<div className="space-y-2">
							<p>Body</p>
							{selectedReq?.body}
						</div>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	)
}
