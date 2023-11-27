import { type IsEqual, type Simplify } from "type-fest"
import { z } from "zod"

import { EventPayload } from "../types"

/**
 * Returns the given generic as either itself or an array of itself.
 */
export type SingleOrArray<T> = T | T[]

/**
 * Returns the given generic as either itself or a promise of itself.
 */
export type MaybePromise<T> = T | Promise<T>

/**
 * Acts like `Partial<T>` but only for the keys in `K`, leaving the rest alone.
 */
export type PartialK<T, K extends PropertyKey = PropertyKey> = Partial<Pick<T, Extract<keyof T, K>>> &
	Omit<T, K> extends infer O
	? { [P in keyof O]: O[P] }
	: never

/**
 * A payload that could be sent to Hazel, based on the given `Events`.
 */
export type SendEventPayload<Events extends Record<string, EventPayload>> = SingleOrArray<
	{
		[K in keyof Events]: PartialK<Omit<Events[K], "v">, "ts">
	}[keyof Events]
>

/**
 * A list of simple, JSON-compatible, primitive types that contain no other
 * values.
 */
export type Primitive = null | undefined | string | number | boolean | symbol | bigint

/**
 * Returns `true` if `T` is a tuple, else `false`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IsTuple<T extends ReadonlyArray<any>> = number extends T["length"] ? false : true

/**
 * Given a tuple `T`, return the keys of that tuple, excluding any shared or
 * generic keys like `number` and standard array methods.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TupleKeys<T extends ReadonlyArray<any>> = Exclude<keyof T, keyof any[]>

/**
 * Returns `true` if `T1` matches anything in the union `T2`, else` never`.
 */
type AnyIsEqual<T1, T2> = T1 extends T2 ? (IsEqual<T1, T2> extends true ? true : never) : never

/**
 * A helper for concatenating an existing path `K` with new paths from the
 * value `V`, making sure to skip those we've already seen in
 * `TraversedTypes`.
 *
 * Purposefully skips some primitive objects to avoid building unsupported or
 * recursive paths.
 */
type PathImpl<K extends string | number, V, TraversedTypes> = V extends Primitive | Date
	? `${K}`
	: true extends AnyIsEqual<TraversedTypes, V>
	? `${K}`
	: `${K}` | `${K}.${PathInternal<V, TraversedTypes | V>}`

/**
 * Start iterating over a given object `T` and return all string paths used to
 * access properties within that object as if you were in code.
 */
type PathInternal<T, TraversedTypes = T> = T extends ReadonlyArray<infer V>
	? IsTuple<T> extends true
		? {
				[K in TupleKeys<T>]-?: PathImpl<K & string, T[K], TraversedTypes>
		  }[TupleKeys<T>]
		: PathImpl<number, V, TraversedTypes>
	: {
			[K in keyof T]-?: PathImpl<K & string, T[K], TraversedTypes>
	  }[keyof T]

/**
 * Given an object, recursively return all string paths used to access
 * properties within that object as if you were in code.
 *
 * This is an exported helper method to ensure we only try to access object
 * paths of known objects.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ObjectPaths<T> = T extends any ? PathInternal<T> : never

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
 * Returns `true` if the given generic `T` is a string literal, e.g. `"foo"`, or
 * `false` if it is a string type, e.g. `string`.
 *
 * Useful for checking whether the keys of an object are known or not.
 *
 * @example
 * ```ts
 * // false
 * type ObjIsGeneric = IsStringLiteral<keyof Record<string, boolean>>;
 *
 * // true
 * type ObjIsKnown = IsStringLiteral<keyof { foo: boolean; }>; // true
 * ```
 *
 * @internal
 */
export type IsStringLiteral<T extends string> = string extends T ? false : true

/**
 * Returns `true` if the given generic `T` is `any`, or `false` if it is not.
 */
export type IsAny<T> = 0 extends 1 & T ? true : false

/**
 * Given a function T, return the awaited return type of that function,
 * ignoring the fact that T may be undefined.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Await<T extends ((...args: any[]) => any) | undefined> = Awaited<ReturnType<NonNullable<T>>>

/**
 * Given an object TAcc and an array of objects TArr, return a new object that
 * is the result of merging all of the objects in TArr into TAcc.
 */
// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type ObjectAssign<TArr, TAcc = {}> = TArr extends [infer TFirst, ...infer TRest]
	? Simplify<ObjectAssign<TRest, Omit<TAcc, keyof TFirst> & TFirst>>
	: TAcc

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

/**
 * A type that represents either `A` or `B`. Shared properties retain their
 * types and unique properties are marked as optional.
 */
export type Either<A, B> = Partial<A> & Partial<B> & (A | B)

/**
 * Given a function `T`, return the parameters of that function, except for the
 * first one.
 */
export type ParametersExceptFirst<T> = T extends (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	arg0: any,
	...rest: infer U
) => any // eslint-disable-next-line @typescript-eslint/no-explicit-any
	? U
	: never

/**
 * Given an object `T`, return `true` if it contains no keys, or `false` if it
 * contains any keys.
 *
 * Useful for detecting the passing of a `{}` (any non-nullish) type.
 */
// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type IsEmptyObject<T> = {} extends T
	? // biome-ignore lint/complexity/noBannedTypes: <explanation>
	  T extends {}
		? true
		: false
	: false

/**
 * The response to send to the local SDK UI when an introspection request is
 * made.
 *
 * @internal
 */
export interface IntrospectRequest {
	message: string

	/**
	 * Represents whether a signing key could be found when running this handler.
	 */
	hasSecretKey: boolean

	/**
	 * Represents whether an event key could be found when running this handler.
	 */
	hasProjectKey: boolean

	/**
	 * The number of Hazel functions found at this handler.
	 */
	webhookHandlerFound: number
}

export const incomingOpSchema = z.object({
	id: z.string().min(1),
	data: z.any().optional(),
	error: z.any().optional(),
})

export type IncomingOp = z.output<typeof incomingOpSchema>
export type OutgoingOp = Pick<HashedOp, "id" | "name" | "opts" | "data" | "error" | "displayName">

/**
 * The shape of a hashed operation in a step function. Used to communicate
 * desired and received operations to Inngest.
 */
export type HashedOp = Op & {
	/**
	 * The hashed identifier for this operation, used to confirm that the
	 * operation was completed when it is received from Inngest.
	 */
	id: string
}

/**
 * The shape of a single operation in a step function. Used to communicate
 * desired and received operations to Inngest.
 */
export type Op = {
	/**
	 * The unique code for this operation.
	 */

	/**
	 * The unhashed step name for this operation. This is a legacy field that is
	 * sometimes used for critical data, like the sleep duration for
	 * `step.sleep()`.
	 *
	 * @deprecated For display name, use `displayName` instead.
	 */
	name?: string

	/**
	 * An optional name for this step that can be used to display in the Inngest
	 * UI.
	 */
	displayName?: string

	/**
	 * Any additional data required for this operation to send to Inngest. This
	 * is not compared when confirming that the operation was completed; use `id`
	 * for this.
	 */
	opts?: Record<string, unknown>

	/**
	 * Any data present for this operation. If data is present, this operation is
	 * treated as completed.
	 */
	data?: unknown

	/**
	 * An error present for this operation. If an error is present, this operation
	 * is treated as completed, but failed. When this is read from the op stack,
	 * the SDK will throw the error via a promise rejection when it is read.
	 *
	 * This allows users to handle step failures using common tools such as
	 * try/catch or `.catch()`.
	 */
	error?: unknown
}

export const sendEventResponseSchema = z.object({
	/**
	 * Event IDs
	 */
	ids: z.array(z.string()),

	/**
	 * HTTP Status Code. Will be undefined if no request was sent.
	 */
	status: z.number(),

	/**
	 * Error message. Will be undefined if no error occurred.
	 */
	error: z.string().optional(),
})

/**
 * The response from the Inngest Event API
 */
export type SendEventResponse = z.output<typeof sendEventResponseSchema>

/**
 * The response in code from sending an event to Inngest.
 */
export type SendEventBaseOutput = {
	ids: SendEventResponse["ids"]
}
