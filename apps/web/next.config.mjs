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
		serverActions: true,
		serverComponentsExternalPackages: ["@trpc/server"],
		optimizePackageImports: ["@hazel/icons"],
	},
	transpilePackages: ["@hazel/db", "@hazel/email", "@hazel/ui", "@hazel/icons"],
	webpack: (config, { isServer }) => {
		if (config.name === "server" || config.name === "edge-server") config.optimization.concatenateModules = false

		if (!isServer) {
			config.resolve.fallback.fs = false
		}

		return config
	},
}

const intlConfig = withNextIntl("./src/i18n/index.ts")

export default intlConfig(nextConfig)
