/**
 * Create a function that will rethrow an error with a prefix added to the
 * message.
 *
 * Useful for adding context to errors that are rethrown.
 *
 * @example
 * ```ts
 * await doSomeAction().catch(rethrowError("Failed to do some action"));
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const rethrowError = (prefix: string): ((err: any) => never) => {
	return (err) => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
			err.message &&= `${prefix}; ${err.message}`
		} catch (noopErr) {
			// no-op
		} finally {
			// biome-ignore lint/correctness/noUnsafeFinally: <explanation>
			throw err
		}
	}
}

export function serializeError(error: Error): Record<string, any> {
	return Object.getOwnPropertyNames(error).reduce(
		(errorObject, key) => {
			errorObject[key] = (error as any)[key]
			return errorObject
		},
		{} as Record<string, any>,
	)
}
