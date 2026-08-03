/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Performance optimizations
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Bundle optimization
  webpack: (config, { isServer }) => {
    // Reduce bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  async rewrites() {
    return [];
  },
  // Enable compression
  compress: true,
  // Optimize static assets
  poweredByHeader: false,
  turbopack: {
    root: 'C:/Users/rana/Pictures/SYN/synapsemed-share'
  },
}

export default nextConfig
