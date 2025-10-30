import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // ou 'export' se for estático
  trailingSlash: true,
    typescript: {
        ignoreBuildErrors: true,
    },
    cacheComponents: true,
    images: {
        unoptimized: true, // se estiver usando Vercel
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            }
        ]
    },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
