/**
 * Returns all keys from objects in the union `T`.
 *
 * @public
 */
export type UnionKeys<T> = T extends T ? keyof T : never

/**
 * Enforces strict union comformity by ensuring that all potential keys in a
 * union of objects are accounted for in every object.
 *
 * Requires two generics to be used, so is abstracted by {@link StrictUnion}.
 *
 * @public
 */
export type StrictUnionHelper<T, TAll> = T extends any
	? T & Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>>
	: never

/**
 * Enforces strict union comformity by ensuring that all potential keys in a
 * union of objects are accounted for in every object.
 *
 * @public
 */
export type StrictUnion<T> = StrictUnionHelper<T, T>

/**
 * Make a type's keys mutually exclusive.
 *
 * @example
 * Make 1 key mutually exclusive with 1 other key.
 *
 * ```ts
 * type MyType = ExclusiveKeys<{a: number, b: number}, "a", "b">
 *
 * const valid1: MyType = { a: 1 }
 * const valid2: MyType = { b: 1 }
 * const invalid1: MyType = { a: 1, b: 1 }
 * ```
 *
 * @example
 * Make 1 key mutually exclusive with 2 other keys.
 *
 * ```ts
 * type MyType = ExclusiveKeys<{a: number, b: number, c: number}, "a", "b" | "c">
 *
 * const valid1: MyType = { a: 1 };
 * const valid2: MyType = { b: 1, c: 1 };
 * const invalid1: MyType = { a: 1, b: 1 };
 * const invalid2: MyType = { a: 1, c: 1 };
 * const invalid3: MyType = { a: 1, b: 1, c: 1 };
 * ```
 */
export type ExclusiveKeys<T, Keys1 extends keyof T, Keys2 extends keyof T> =
	| (Omit<T, Keys1> & { [K in Keys1]?: never })
	| (Omit<T, Keys2> & { [K2 in Keys2]?: never })
