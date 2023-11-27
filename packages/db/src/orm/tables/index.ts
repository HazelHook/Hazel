import { SQL } from "drizzle-orm"

import { TrxType } from "../../utils"

export type BaseFilters<T> = {
	publicId: string
	with?: T
	where?: SQL
	[keys: string]: any
}

export type EntityLogic = {
	table: any
	getOne: <T>(data: BaseFilters<T>, tx?: TrxType) => any | null
	getMany: (params: any, tx?: TrxType) => Promise<any[]>
	create: (data: any, tx?: TrxType) => Promise<{ publicId: string; [keys: string]: any }>
	update: (data: any, tx?: TrxType) => Promise<{ publicId: string; [keys: string]: any }>
	delete: (
		params: {
			publicId: string
		},
		tx?: TrxType,
	) => Promise<{ publicId: string; [keys: string]: any }>
	[key: string]: any
}
