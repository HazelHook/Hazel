/**
 * @public
 */
export type Env = Record<string, EnvValue>

/**
 * @public
 */
export type EnvValue = string | undefined

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

declare const Deno: {
	env: { toObject: () => Env }
}

/**
 * allProcessEnv returns the current process environment variables, or an empty
 * object if they cannot be read, making sure we support environments other than
 * Node such as Deno, too.
 *
 * Using this ensures we don't dangerously access `process.env` in environments
 * where it may not be defined, such as Deno or the browser.
 */
export const allProcessEnv = (): Env => {
	try {
		// eslint-disable-next-line @inngest/internal/process-warn
		if (process.env) {
			// eslint-disable-next-line @inngest/internal/process-warn
			return process.env
		}
	} catch (_err) {
		// noop
	}

	try {
		const env = Deno.env.toObject()

		if (env) {
			return env
		}
	} catch (_err) {
		// noop
	}

	return {}
}
