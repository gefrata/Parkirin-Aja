/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ]
  },
  // Atau tambah environment variable
  env: {
    NEXT_PUBLIC_API_URL: 'http://localhost:8000',
  },
}

module.exports = nextConfig
