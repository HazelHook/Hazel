import pkg from "../../../package.json"
import { Hazel } from "../../core/hazel"
import { envKeys, headerKeys } from "../const"

declare const EdgeRuntime: string | undefined

/**
 * @public
 */
export type Env = Record<string, EnvValue>

/**
 * @public
 */
export type EnvValue = string | undefined

/**
 * getEnvironmentName returns the suspected branch name for this environment by
 * searching through a set of common environment variables.
 *
 * This could be used to determine if we're on a branch deploy or not, though it
 * should be noted that we don't know if this is the default branch or not.
 */
export const getEnvironmentName = (env: Env = allProcessEnv()): EnvValue => {
	/**
	 * Order is important; more than one of these env vars may be set, so ensure
	 * that we check the most specific, most reliable env vars first.
	 */
	return (
		env[envKeys.HazelEnvironment] ||
		env[envKeys.BranchName] ||
		env[envKeys.VercelBranch] ||
		env[envKeys.NetlifyBranch] ||
		env[envKeys.CloudflarePagesBranch] ||
		env[envKeys.RenderBranch] ||
		env[envKeys.RailwayBranch]
	)
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
		if (process.env) {
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

/**
 * Generate a standardised set of headers based on input and environment
 * variables.
 *
 *
 */
export const hazelHeaders = (opts?: {
	/**
	 * The environment variables to use instead of `process.env` or any other
	 * default source. Useful for platforms where environment variables are passed
	 * in alongside requests.
	 */
	env?: Env
	/**
	 * The framework name to use in the `X-Hazel-Framework` header. This is not
	 * always available, hence being optional.
	 */
	framework?: string

	/**
	 * The environment name to use in the `X-hazel-Env` header. This is likely
	 * to be representative of the target preview environment.
	 */
	hazelEnv?: string

	/**
	 * The hazel client that's making the request. The client itself will
	 * generate a set of headers; specifying it here will ensure that the client's
	 * headers are included in the returned headers.
	 */
	client?: Hazel<any>
}): Record<string, string> => {
	const sdkVersion = `hazel-client:v${pkg.version}`
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		"User-Agent": sdkVersion,
		[headerKeys.SdkVersion]: sdkVersion,
	}

	if (opts?.framework) {
		headers[headerKeys.Framework] = opts.framework
	}

	const env = {
		...allProcessEnv(),
		...opts?.env,
	}

	const hazelEnv = opts?.hazelEnv || getEnvironmentName(process.env)
	if (hazelEnv) {
		headers[headerKeys.Environment] = hazelEnv
	}

	const platform = getPlatformName(env)
	if (platform) {
		headers[headerKeys.Platform] = platform
	}

	return {
		...headers,
		...opts?.client?.headers,
	}
}

/**
 * A set of checks that, given an environment, will return `true` if the current
 * environment is running on the platform with the given name.
 */
const platformChecks = {
	/**
	 * Vercel Edge Functions don't have access to environment variables unless
	 * they are explicitly referenced in the top level code, but they do have a
	 * global `EdgeRuntime` variable set that we can use to detect this.
	 */
	vercel: (env) => env[envKeys.IsVercel] === "1" || typeof EdgeRuntime === "string",
	netlify: (env) => env[envKeys.IsNetlify] === "true",
	"cloudflare-pages": (env) => env[envKeys.IsCloudflarePages] === "1",
	render: (env) => env[envKeys.IsRender] === "true",
	railway: (env) => Boolean(env[envKeys.RailwayEnvironment]),
} satisfies Record<string, (env: Env) => boolean>

const getPlatformName = (env: Env) => {
	return (Object.keys(platformChecks) as (keyof typeof platformChecks)[]).find((key) => {
		return platformChecks[key](env)
	})
}

/**
 * If `Response` isn't included in this environment, it's probably an earlier
 * Node env that isn't already polyfilling. This function returns either the
 * native `Response` or a polyfilled one.
 */
export const getResponse = (): typeof Response => {
	if (typeof Response !== "undefined") {
		return Response
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
	return require("cross-fetch").Response
}
