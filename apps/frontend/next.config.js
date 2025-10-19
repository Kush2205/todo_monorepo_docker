/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		// If the shared package uses ESM/TypeScript, let Next handle it
		// and allow imports from outside the app dir in a monorepo
		externalDir: true,
	},
	transpilePackages: ["@repo/db", "@repo/ui"],
};

export default nextConfig;
