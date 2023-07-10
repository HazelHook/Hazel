/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		serverActions: true,
		serverComponentsExternalPackages: ["@trpc/server"],
	},
	transpilePackages: ["ui"],
	webpack: (config) => {
		if (config.name === "server" || config.name === "edge-server") config.optimization.concatenateModules = false

		return config
	},
}

export default nextConfig
