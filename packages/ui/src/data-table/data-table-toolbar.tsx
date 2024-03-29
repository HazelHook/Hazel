"use client"

import * as React from "react"
import Link from "next/link"

import type { Table } from "@tanstack/react-table"

import { Button, buttonVariants } from "../button"
import { Input } from "../input"
import { cn } from "../utils"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableViewOptions } from "./data-table-view-options"
import type { DataTableFilterableColumn, DataTableSearchableColumn } from "./types"
import { IconCirclePlus, IconTrash, IconX } from "@tabler/icons-react"

interface DataTableToolbarProps<TData> {
	table: Table<TData>
	filterableColumns?: DataTableFilterableColumn<TData>[]
	searchableColumns?: DataTableSearchableColumn<TData>[]
	newRowLink?: string
	deleteRowsAction?: React.MouseEventHandler<HTMLButtonElement>
	disableViewToggle?: boolean
}

export function DataTableToolbar<TData>({
	table,
	filterableColumns = [],
	searchableColumns = [],
	newRowLink,
	deleteRowsAction,
	disableViewToggle,
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0
	const [isPending, startTransition] = React.useTransition()

	return (
		<div className="flex w-full items-center justify-between space-x-2 overflow-auto p-1">
			<div className="flex flex-1 items-center space-x-2">
				{searchableColumns.length > 0 &&
					searchableColumns.map(
						(column) =>
							table.getColumn(column.id ? String(column.id) : "") && (
								<Input
									key={String(column.id)}
									placeholder={`Filter ${column.title}...`}
									value={(table.getColumn(String(column.id))?.getFilterValue() as string) ?? ""}
									onChange={(event) =>
										table.getColumn(String(column.id))?.setFilterValue(event.target.value)
									}
									className="h-8 w-[150px] lg:w-[250px]"
								/>
							),
					)}
				{filterableColumns.length > 0 &&
					filterableColumns.map(
						(column) =>
							table.getColumn(column.id ? String(column.id) : "") && (
								<DataTableFacetedFilter
									key={String(column.id)}
									column={table.getColumn(column.id ? String(column.id) : "")}
									title={column.title}
									options={column.options}
								/>
							),
					)}
				{isFiltered && (
					<Button
						aria-label="Reset filters"
						variant="ghost"
						className="h-8 px-2 lg:px-3"
						onClick={() => table.resetColumnFilters()}
					>
						Reset
						<IconX className="ml-2 h-4 w-4" aria-hidden="true" />
					</Button>
				)}
			</div>
			<div className="flex items-center space-x-2">
				{deleteRowsAction && table.getSelectedRowModel().rows.length > 0 ? (
					<Button
						aria-label="Delete selected rows"
						variant="outline"
						size="sm"
						className="h-8"
						onClick={(event) => {
							startTransition(() => {
								table.toggleAllPageRowsSelected(false)
								deleteRowsAction(event)
							})
						}}
						disabled={isPending}
					>
						<IconTrash className="mr-2 h-4 w-4" aria-hidden="true" />
						Delete
					</Button>
				) : newRowLink ? (
					<Link aria-label="Create new row" href={newRowLink}>
						<div
							className={cn(
								buttonVariants({
									variant: "outline",
									size: "sm",
									className: "h-8",
								}),
							)}
						>
							<IconCirclePlus className="mr-2 h-4 w-4" aria-hidden="true" />
							New
						</div>
					</Link>
				) : null}
				{!disableViewToggle && <DataTableViewOptions table={table} />}
			</div>
		</div>
	)
}
