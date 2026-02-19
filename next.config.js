/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // AWS Amplify usa next start - NO usar output: 'standalone'
  // Excluir carpeta lambda del build
  webpack: (config) => {
    config.externals = config.externals || []
    config.externals.push({
      'aws-sdk': 'commonjs aws-sdk',
    })
    return config
  },
}

module.exports = nextConfig

