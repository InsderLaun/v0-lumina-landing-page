/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  generateBuildId: () => `build-${Date.now()}`,
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
    ];
  },
  // [10x10 fix C-2] /docs used to serve a stale V5.1 GitHub-mirrored doc
  // site, returning 200 OK and competing with the canonical Mintlify site
  // at docs.lumina-org.com. 308 redirects send all traffic + SEO juice to
  // the live site and unify any old links/tweets.
  async redirects() {
    return [
      {
        source: "/docs",
        destination: "https://docs.lumina-org.com",
        permanent: true,
      },
      {
        source: "/docs/:path*",
        destination: "https://docs.lumina-org.com/:path*",
        permanent: true,
      },
    ];
  },
}

export default nextConfig
