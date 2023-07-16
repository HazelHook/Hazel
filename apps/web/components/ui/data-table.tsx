"use client"

import { MouseEventHandler, ReactNode, useState } from "react"
import { useRouter } from "next/navigation"
import {
	Column,
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowUpSquareIcon } from "@/components/icons/pika/arrowUpSquare"
import { ArrowDownSquareIcon } from "@/components/icons/pika/arrowDownSquare"

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	rootPath?: string
	disableRedirect?: boolean
}

export function DataTable<TData, TValue>({ columns, data, rootPath, disableRedirect }: DataTableProps<TData, TValue>) {
	const router = useRouter()
	const [sorting, setSorting] = useState<SortingState>([])

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),

		state: {
			sorting,
		},
	})

	const navigate = (data: TData) => (e: any) => {
		if (disableRedirect) return
		router.push(`${rootPath}/${(data as any).publicId}`)
	}

	return (
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
								onClick={navigate(row.original)}
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center px-4">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	)
}

export const SortableHeader = ({
	column,
	name,
	className,
}: { column: Column<any, unknown>; name: string; className?: string }) => {
	return (
		<div className="flex justify-start w-full">
			<Button
				className={className}
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				{name}
				{column.getIsSorted() === "asc" ? (
					<ArrowUpSquareIcon className="ml-2 h-4 w-4" />
				) : (
					<ArrowDownSquareIcon className="ml-2 h-4 w-4" />
				)}
			</Button>
		</div>
	)
}

export const Cell = ({ children }: { children: ReactNode }) => {
	return <div className="flex flex-row items-center px-6 gap-2">{children}</div>
}
