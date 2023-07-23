export type Required<T> = {
	[P in keyof T]-?: T[P]
}

export type PromiseType<T> = T extends Promise<infer U> ? U : never
