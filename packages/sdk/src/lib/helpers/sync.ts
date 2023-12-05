// This function wraps a synchronous function and returns a promise.
// The type parameter T represents the return type of the synchronous function.
export function awaitSync<T>(fn: () => T): Promise<T> {
	return new Promise<T>((resolve) => {
		try {
			resolve(fn())
		} catch (error) {
			// If the function throws an error, reject the promise.
			if (error instanceof Error) {
				return Promise.reject(error)
			}
			// If it's not an instance of Error, wrap it in an Error object.
			return Promise.reject(new Error(String(error)))
		}
	})
}
