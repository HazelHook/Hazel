import million from "million/compiler"

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
	},
	transpilePackages: ["db"],
	webpack: (config, { isServer }) => {
		if (config.name === "server" || config.name === "edge-server") config.optimization.concatenateModules = false

		if (!isServer) {
			config.resolve.fallback.fs = false
		}

		return config
	},
}

export default nextConfig
