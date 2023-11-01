export enum envKeys {
	InngestSigningKey = "INNGEST_SIGNING_KEY",
	InngestEventKey = "INNGEST_EVENT_KEY",

	/**
	 * @deprecated Removed in v3. Use {@link InngestBaseUrl} instead.
	 */
	InngestDevServerUrl = "INNGEST_DEVSERVER_URL",
	InngestEnvironment = "INNGEST_ENV",
	InngestBaseUrl = "INNGEST_BASE_URL",
	InngestServeHost = "INNGEST_SERVE_HOST",
	InngestServePath = "INNGEST_SERVE_PATH",
	InngestLogLevel = "INNGEST_LOG_LEVEL",
	InngestStreaming = "INNGEST_STREAMING",

	BranchName = "BRANCH_NAME",

	/**
	 * @deprecated Removed in v3. Use {@link InngestBaseUrl} instead.
	 */
	InngestApiBaseUrl = "INNGEST_API_BASE_URL",

	/**
	 * The git branch of the commit the deployment was triggered by. Example:
	 * `improve-about-page`.
	 *
	 * {@link https://vercel.com/docs/concepts/projects/environment-variables/system-environment-variables#system-environment-variables}
	 */
	VercelBranch = "VERCEL_GIT_COMMIT_REF",

	/**
	 * Expected to be `"1"` if defined.
	 */
	IsVercel = "VERCEL",

	/**
	 * The branch name of the current deployment. May only be accessible at build
	 * time, but included here just in case.
	 *
	 * {@link https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables}
	 */
	CloudflarePagesBranch = "CF_PAGES_BRANCH",

	/**
	 * Expected to be `"1"` if defined.
	 */
	IsCloudflarePages = "CF_PAGES",

	/**
	 * The branch name of the deployment from Git to Netlify, if available.
	 *
	 * {@link https://docs.netlify.com/configure-builds/environment-variables/#git-metadata}
	 */
	NetlifyBranch = "BRANCH",

	/**
	 * Expected to be `"true"` if defined.
	 */
	IsNetlify = "NETLIFY",

	/**
	 * The Git branch for a service or deploy.
	 *
	 * {@link https://render.com/docs/environment-variables#all-services}
	 */
	RenderBranch = "RENDER_GIT_BRANCH",

	/**
	 * Expected to be `"true"` if defined.
	 */
	IsRender = "RENDER",

	/**
	 * The branch that triggered the deployment. Example: `main`
	 *
	 * {@link https://docs.railway.app/develop/variables#railway-provided-variables}
	 */
	RailwayBranch = "RAILWAY_GIT_BRANCH",

	/**
	 * The railway environment for the deployment. Example: `production`
	 *
	 * {@link https://docs.railway.app/develop/variables#railway-provided-variables}
	 */
	RailwayEnvironment = "RAILWAY_ENVIRONMENT",
}

/**
 * Keys for accessing headers included in requests from Inngest to run
 * functions.
 *
 * Used internally to create handlers using `HazelCommHandler`, but can be
 * imported to be used if creating a custom handler outside of the package.
 *
 * @public
 */
export enum headerKeys {
	Signature = "x-hazel-signature",
	SdkVersion = "x-hazel-sdk",
	Environment = "x-hazel-env",
	Platform = "x-hazel-platform",
	Framework = "x-hazel-framework",
}
