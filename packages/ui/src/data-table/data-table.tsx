"use client"

import { ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	PaginationState,
	SortingState,
	useReactTable,
} from "@tanstack/react-table"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table"
import { DataTablePagination } from "./data-table-pagination"
import { Sheet, SheetContent } from "../sheet"

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
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const [sheetId, setSheetId] = useState<string>()

	// Search params
	const page = searchParams?.get("page") ?? "1"
	const pageAsNumber = Number(page)
	const fallbackPage = Number.isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber
	const per_page = searchParams?.get("per_page") ?? "10"
	const perPageAsNumber = Number(per_page)
	const fallbackPerPage = Number.isNaN(perPageAsNumber) ? 10 : perPageAsNumber
	const sort = searchParams?.get("sort")
	const [column, order] = sort?.split(".") ?? []

	// Create query string
	const createQueryString = useCallback(
		(params: Record<string, string | number | null>) => {
			const newSearchParams = new URLSearchParams(searchParams?.toString())

			for (const [key, value] of Object.entries(params)) {
				if (value === null) {
					newSearchParams.delete(key)
				} else {
					newSearchParams.set(key, String(value))
				}
			}

			return newSearchParams.toString()
		},
		[searchParams],
	)

	// Handle server-side sorting
	const [sorting, setSorting] = useState<SortingState>([
		{
			id: column ?? "",
			desc: order === "desc",
		},
	])

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		router.push(
			`${pathname}?${createQueryString({
				page,
				sort: sorting[0]?.id ? `${sorting[0]?.id}.${sorting[0]?.desc ? "desc" : "asc"}` : null,
			})}`,
		)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sorting])

	// Handle server-side pagination
	const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
		pageIndex: fallbackPage - 1,
		pageSize: fallbackPerPage,
	})

	const pagination = useMemo(
		() => ({
			pageIndex,
			pageSize,
		}),
		[pageIndex, pageSize],
	)

	useEffect(() => {
		setPagination({
			pageIndex: fallbackPage - 1,
			pageSize: fallbackPerPage,
		})
	}, [fallbackPage, fallbackPerPage])

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		router.push(
			`${pathname}?${createQueryString({
				page: pageIndex + 1,
				per_page: pageSize,
			})}`,
			{
				scroll: false,
			},
		)
	}, [pageIndex, pageSize])

	const selectedRequest = useMemo(() => data.find((datum) => datum.id === sheetId), [data, sheetId])

	const table = useReactTable({
		data,
		columns,
		pageCount: Math.ceil(maxItems / pageSize),
		state: {
			pagination,
			sorting,
		},
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		onPaginationChange: setPagination,
		manualPagination: true,
		manualSorting: true,
		manualFiltering: true,
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
			<DataTablePagination table={table} maxCount={maxItems} hasFilter={false} />
			<Sheet open={!!sheetId} onOpenChange={handleSheetOpen}>
				<SheetContent>
					<div className="grid gap-4 py-4">{selectedRequest && renderSheet?.(selectedRequest)}</div>
				</SheetContent>
			</Sheet>
		</div>
	)
}
