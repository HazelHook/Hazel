import million from "million/compiler"

import withNextIntl from "next-intl/plugin"

const millionConfig = {
	// if you're using RSC:
	auto: { rsc: true },
}

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		serverComponentsExternalPackages: ["@trpc/server"],
		optimizePackageImports: ["@hazel/icons"],
		webpackBuildWorker: false,
		instrumentationHook: true,
	},
	devIndicators: {
		buildActivityPosition: "top-right",
	},
	transpilePackages: [
		"@hazel/admin",
		"@hazel/auth",
		"@hazel/client",
		"@hazel/db",
		"@hazel/ui",
		"@hazel/utils",
		"@hazel/icons",
		"@hazel/tinybird",
		"@hazel/supabase",
		"@hazel/server",
	],
	webpack: (config, { isServer, nextRuntime }) => {
		if (config.name === "server" || config.name === "edge-server") config.optimization.concatenateModules = false

		if (!isServer) {
			config.resolve.fallback.fs = false
		}

		if (isServer && nextRuntime === "edge") {
			// pino's dependencies use native node apis,
			// which are not available in the edge runtime,
			// so we're using the browser version of pino here
			// see https://nextjs.org/docs/app/api-reference/edge#unsupported-apis
			config.resolve.alias.pino = "pino/browser.js"
		}

		return config
	},
}

const intlConfig = withNextIntl("./src/i18n/index.ts")

export default million.next(intlConfig(nextConfig), millionConfig)
// export default intlConfig(nextConfig)
