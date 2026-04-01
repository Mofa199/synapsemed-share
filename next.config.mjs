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
  // Performance optimizations
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // API routes configuration
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Set limit for file uploads
    },
    responseLimit: false, // Disable response size limit
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
  // Enable compression
  compress: true,
  // Optimize static assets
  poweredByHeader: false,
}

export default nextConfig
