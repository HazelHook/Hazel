/**
 * Given a potential fetch function, return the fetch function to use based on
 * this and the environment.
 */
export const getFetch = (givenFetch?: typeof fetch): typeof fetch => {
	if (givenFetch) {
		return givenFetch
	}

	/**
	 * Browser or Node 18+
	 */
	try {
		if (typeof globalThis !== "undefined" && "fetch" in globalThis) {
			return fetch.bind(globalThis)
		}
	} catch (err) {
		// no-op
	}

	/**
	 * Existing polyfilled fetch
	 */
	if (typeof fetch !== "undefined") {
		return fetch
	}

	/**
	 * Environments where fetch cannot be found and must be polyfilled
	 */
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	return require("cross-fetch") as typeof fetch
}
