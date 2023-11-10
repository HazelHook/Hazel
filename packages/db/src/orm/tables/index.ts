import { SQL, WithSubquery } from "drizzle-orm"
import { TrxType } from "../../utils"

export type EntityLogic = {
	table: any
	getOne: (
		data: {
			publicId: string
			where?: SQL
			include?: WithSubquery
		},
		tx?: TrxType,
	) => any | null
	getMany: (params: any, tx?: TrxType) => Promise<any[]>
	create: (data: any, tx?: TrxType) => Promise<{ publicId: string; [keys: string]: any }>
	update: (data: any, tx?: TrxType) => Promise<{ publicId: string; [keys: string]: any }>
	markAsDeleted: (
		params: {
			publicId: string
		},
		tx?: TrxType,
	) => Promise<{ publicId: string; [keys: string]: any }>
	[key: string]: any
}
