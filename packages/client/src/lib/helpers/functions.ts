/**
 * Wraps a function with a cache. When the returned function is run, it will
 * cache the result and return it on subsequent calls.
 */

import { Await } from "./types"

export const cacheFn = <T extends (...args: any[]) => any>(fn: T): T => {
	const key = "value"
	const cache = new Map<typeof key, unknown>()

	return ((...args) => {
		if (!cache.has(key)) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			cache.set(key, fn(...args))
		}

		return cache.get(key)
	}) as T
}

/**
 * Given an array of functions, return a new function that will run each
 * function in series and return the result of the final function. Regardless of
 * if the functions are synchronous or asynchronous, they'll be made into an
 * async promise chain.
 *
 * If an error is thrown, the waterfall will stop and return the error.
 *
 * Because this needs to support both sync and async functions, it only allows
 * functions that accept a single argument.
 */
export const waterfall = <TFns extends ((arg?: any) => any)[]>(
	fns: TFns,

	/**
	 * A function that transforms the result of each function in the waterfall,
	 * ready for the next function.
	 *
	 * Will not be called on the final function.
	 */
	transform?: (prev: any, output: any) => any,
): ((...args: Parameters<TFns[number]>) => Promise<Await<TFns[number]>>) => {
	return (...args) => {
		const chain = fns.reduce(async (acc, fn) => {
			const prev = await acc
			const output = (await fn(prev)) as Promise<Await<TFns[number]>>

			return transform ? await transform(prev, output) : output
		}, Promise.resolve(args[0]))

		return chain
	}
}
