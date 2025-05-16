/** @type {import('next').NextConfig} */
const nextConfig = {
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
