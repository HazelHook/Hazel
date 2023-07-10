/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		serverActions: true,
		serverComponentsExternalPackages: ["@trpc/server"],
	},
	transpilePackages: ["ui"],
	webpack: (config) => {
		console.log(config.name)
		if (config.name === "server") config.optimization.concatenateModules = false
		if (config.name === "edge-server") config.optimization.concatenateModules = false

		return config
	},
}

export default nextConfig
