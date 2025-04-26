/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  basePath: '/prompt-refactor',       // 🔁 Replace this
  assetPrefix: '/prompt-refactor',    // 🔁 Replace this
}

export default nextConfig
