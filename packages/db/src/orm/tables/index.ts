export type EntityLogic = {
	table: any
	getOne: (params: {
		publicId: string
		includeDeleted?: boolean
	}) => any | null
	getMany: (params: any) => Promise<any[]>
	create: (data: any) => Promise<{ publicId: string; [keys: string]: any }>
	update: (data: any) => Promise<{ publicId: string; [keys: string]: any }>
	markAsDeleted: (params: {
		publicId: string
	}) => Promise<{ publicId: string; [keys: string]: any }>
	[key: string]: any
}
