import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  turbopack: {
    resolveAlias: {
      // Leaflet uses browser APIs — alias empty module for SSR
      'leaflet': { browser: 'leaflet', node: './src/lib/leaflet-stub.ts' },
    },
  },
}

export default nextConfig
