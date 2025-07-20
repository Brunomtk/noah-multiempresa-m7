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
  experimental: {
    // Adiciona a origem permitida para o desenvolvimento para resolver o aviso de CORS
    allowedDevOrigins: ['http://26.152.200.67']
  }
}

export default nextConfig
