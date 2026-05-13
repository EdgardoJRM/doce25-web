/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /** Refuerzo: apex (y typo común) → www; el mismo criterio está en middleware.ts */
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'doce25.org' }],
        destination: 'https://www.doce25.org/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'dosce25.org' }],
        destination: 'https://www.doce25.org/:path*',
        permanent: true,
      },
    ]
  },
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
