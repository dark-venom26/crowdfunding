/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['gateway.pinata.cloud', 'source.unsplash.com']
  },
}

module.exports = nextConfig
