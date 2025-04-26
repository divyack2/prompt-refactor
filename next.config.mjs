/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/prompt-refactor',
  assetPrefix: '/prompt-refactor',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig;