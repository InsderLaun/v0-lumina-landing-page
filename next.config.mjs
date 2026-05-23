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
  // [Sprint Polish Final] Agent-discovery files mirrored from the canonical
  // Mintlify docs site. Rewrites (200) instead of redirects (3xx) so that
  // LLMs probing the apex domain get the actual content back and don't have
  // to follow a redirect chain. Source-of-truth lives in org-lumina/docs.
  async rewrites() {
    return [
      {
        source: "/llms.txt",
        destination: "https://docs.lumina-org.com/llms.txt",
      },
      {
        source: "/llms-full.txt",
        destination: "https://docs.lumina-org.com/llms-full.txt",
      },
      {
        source: "/agent.md",
        destination: "https://docs.lumina-org.com/llms.txt",
      },
      {
        source: "/.well-known/ai-plugin.json",
        destination: "https://docs.lumina-org.com/.well-known/ai-plugin.json",
      },
    ];
  },
}

export default nextConfig
