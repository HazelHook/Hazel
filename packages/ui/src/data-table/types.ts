import { ReactNode } from "react"

export type Option = {
	label: ReactNode
	value: string
	icon?: React.ComponentType<{ className?: string }>
}

export interface DataTableFilterOption<TData> {
	id?: string
	label: string
	value: keyof TData | string
	items: Option[]
	isMulti?: boolean
}

export interface DataTableSearchableColumn<TData> {
	id: keyof TData | (string & {})
	title: string
}

export interface DataTableFilterableColumn<TData> extends DataTableSearchableColumn<TData> {
	options: Option[]
}
