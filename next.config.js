/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	experimental: {
		webpackBuildWorker: true,
	},
	webpack: (config, { isServer }) => {
		// Only apply this configuration to the client-side bundle
		if (!isServer) {
			config.resolve.fallback = {
				// List Node.js built-in modules you want to exclude from the client bundle
				fs: false,
				net: false,
				readline: false,
				// You might need to add others depending on errors (e.g., 'path', 'stream', 'crypto')
				path: false,
				stream: false,
				crypto: false,
			};

			// Additionally, you might need to exclude specific problematic packages
			// This tells Webpack to treat these packages as external dependencies that
			// should not be bundled for the client. The 'commonjs' part indicates
			// they are expected to be available in a CommonJS environment (like Node.js),
			// effectively excluding them from the browser bundle.
			config.externals = {
				...config.externals, // Keep any existing externals
				'mongodb-memory-server': 'commonjs mongodb-memory-server',
				'get-port': 'commonjs get-port',
				// You might need to add other server-side/dev packages here if errors persist
			};
		}

		// Important: return the modified config
		return config;
	},
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
			},
			{
				protocol: "https",
				hostname: "house-of-reika.vercel.app",
			},
			{
				protocol: "https",
				hostname: "**.vercel.app",
			},
			{
				protocol: 'https',
				hostname: "houseofreika.com"
			}
		],
	},
};

module.exports = nextConfig;
