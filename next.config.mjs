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
    return [
      {
        source: '/api/curricula/:path*',
        destination: 'http://localhost:8081/api/v2/curricula/:path*',
      },
      {
        source: '/api/modules/:path*',
        destination: 'http://localhost:8081/api/v2/modules/:path*',
      },
      {
        source: '/api/topics/:path*',
        destination: 'http://localhost:8081/api/v2/topics/:path*',
      },
      {
        source: '/api/books/:path*',
        destination: 'http://localhost:8081/api/v2/books/:path*',
      },
      {
        source: '/api/drug-classes/:path*',
        destination: 'http://localhost:8081/api/v2/drug-classes/:path*',
      },
      {
        source: '/api/drugs/:path*',
        destination: 'http://localhost:8081/api/v2/drugs/:path*',
      },
      {
        source: '/api/question-banks/:path*',
        destination: 'http://localhost:8081/api/v2/question-banks/:path*',
      },
      {
        source: '/api/questions/:path*',
        destination: 'http://localhost:8081/api/v2/questions/:path*',
      },
      {
        source: '/api/flashcard-sets/:path*',
        destination: 'http://localhost:8081/api/v2/flashcard-sets/:path*',
      },
      {
        source: '/api/flashcards/:path*',
        destination: 'http://localhost:8081/api/v2/flashcards/:path*',
      },
      {
        source: '/api/simulations/:path*',
        destination: 'http://localhost:8081/api/v2/simulations/:path*',
      },
      {
        source: '/api/simulation-steps/:path*',
        destination: 'http://localhost:8081/api/v2/simulation-steps/:path*',
      },
      {
        source: '/api/study-guides/:path*',
        destination: 'http://localhost:8081/api/v2/study-guides/:path*',
      },
      {
        source: '/api/videos/:path*',
        destination: 'http://localhost:8081/api/v2/videos/:path*',
      },
      {
        source: '/api/magazines/:path*',
        destination: 'http://localhost:8081/api/v2/magazines/:path*',
      },
      {
        source: '/api/magazine-articles/:path*',
        destination: 'http://localhost:8081/api/v2/magazine-articles/:path*',
      },
      {
        source: '/api/articles/:path*',
        destination: 'http://localhost:8081/api/v2/articles/:path*',
      },
      {
        source: '/api/concepts/:path*',
        destination: 'http://localhost:8081/api/v2/concepts/:path*',
      },
      {
        source: '/api/users/:path*',
        destination: 'http://localhost:8081/api/v2/users/:path*',
      },
      {
        source: '/api/bookmarks/:path*',
        destination: 'http://localhost:8081/api/v2/bookmarks/:path*',
      },
      {
        source: '/api/highlights/:path*',
        destination: 'http://localhost:8081/api/v2/highlights/:path*',
      },
      {
        source: '/api/ratings/:path*',
        destination: 'http://localhost:8081/api/v2/ratings/:path*',
      },
      {
        source: '/api/progress/:path*',
        destination: 'http://localhost:8081/api/v2/progress/:path*',
      },
      {
        source: '/api/chat-messages/:path*',
        destination: 'http://localhost:8081/api/v2/chat-messages/:path*',
      },
      {
        source: '/api/badges/:path*',
        destination: 'http://localhost:8081/api/v2/badges/:path*',
      },
      {
        source: '/api/user-badges/:path*',
        destination: 'http://localhost:8081/api/v2/user-badges/:path*',
      },
      {
        source: '/api/challenges/:path*',
        destination: 'http://localhost:8081/api/v2/challenges/:path*',
      },
      {
        source: '/api/user-challenges/:path*',
        destination: 'http://localhost:8081/api/v2/user-challenges/:path*',
      },
      {
        source: '/api/notes/:path*',
        destination: 'http://localhost:8081/api/v2/notes/:path*',
      },
      {
        source: '/api/spaced-repetition-cards/:path*',
        destination: 'http://localhost:8081/api/v2/spaced-repetition-cards/:path*',
      },
    ]
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
