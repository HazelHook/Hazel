"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import {
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	Row,
	useReactTable,
	type ColumnDef,
	type ColumnFiltersState,
	type PaginationState,
	type SortingState,
	type VisibilityState,
} from "@tanstack/react-table"

import { useDebounce } from "../hooks/use-debounce"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table"
import { DataTableAdvancedToolbar } from "./advanced/data-table-advanced-toolbar"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"
import type { DataTableFilterableColumn, DataTableSearchableColumn } from "./types"

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	maxItems: number
	data: TData[]
	filterableColumns?: DataTableFilterableColumn<TData>[]
	searchableColumns?: DataTableSearchableColumn<TData>[]
	disableViewToggle?: boolean
	advancedFilter?: boolean
	onRowClick?: (data: Row<TData>) => void
}

export function AdvancedDataTable<TData, TValue>({
	columns,
	data,
	maxItems,
	filterableColumns = [],
	searchableColumns = [],
	advancedFilter = false,
	disableViewToggle = false,
	onRowClick,
}: DataTableProps<TData, TValue>) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

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

	// Table states
	const [rowSelection, setRowSelection] = useState({})
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

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
	}, [sorting])

	// Handle server-side filtering
	const debouncedSearchableColumnFilters = JSON.parse(
		useDebounce(
			JSON.stringify(
				columnFilters.filter((filter) => {
					return searchableColumns.find((column) => column.id === filter.id)
				}),
			),
			500,
		),
	) as ColumnFiltersState

	const filterableColumnFilters = columnFilters.filter((filter) => {
		return filterableColumns.find((column) => column.id === filter.id)
	})

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		for (const column of debouncedSearchableColumnFilters) {
			if (typeof column.value === "string") {
				router.push(
					`${pathname}?${createQueryString({
						page: 1,
						[column.id]: typeof column.value === "string" ? column.value : null,
					})}`,
				)
			}
		}

		for (const key of searchParams.keys()) {
			if (
				searchableColumns.find((column) => column.id === key) &&
				!debouncedSearchableColumnFilters.find((column) => column.id === key)
			) {
				router.push(
					`${pathname}?${createQueryString({
						page: 1,
						[key]: null,
					})}`,
				)
			}
		}
	}, [JSON.stringify(debouncedSearchableColumnFilters)])

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		for (const column of filterableColumnFilters) {
			if (typeof column.value === "object" && Array.isArray(column.value)) {
				router.push(
					`${pathname}?${createQueryString({
						page: 1,
						[column.id]: column.value.join("."),
					})}`,
				)
			}
		}

		for (const key of searchParams.keys()) {
			if (
				filterableColumns.find((column) => column.id === key) &&
				!filterableColumnFilters.find((column) => column.id === key)
			) {
				router.push(
					`${pathname}?${createQueryString({
						page: 1,
						[key]: null,
					})}`,
				)
			}
		}
	}, [JSON.stringify(filterableColumnFilters)])

	const table = useReactTable({
		data,
		columns,
		pageCount: Math.ceil(maxItems / pageSize),
		state: {
			pagination,
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		manualPagination: true,
		manualSorting: true,
		manualFiltering: true,
	})

	return (
		<div className="w-full space-y-2.5 overflow-auto">
			{advancedFilter ? (
				<DataTableAdvancedToolbar
					table={table}
					filterableColumns={filterableColumns}
					searchableColumns={searchableColumns}
				/>
			) : (
				<DataTableToolbar
					table={table}
					filterableColumns={filterableColumns}
					searchableColumns={searchableColumns}
					disableViewToggle={disableViewToggle}
				/>
			)}
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
												: flexRender(header.column.columnDef.header, header.getContext())}
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
									key={row.id}
									onClick={() => onRowClick?.(row)}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
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
			<div className="space-y-2.5">
				<DataTablePagination table={table} maxCount={maxItems} />
			</div>
		</div>
	)
}
