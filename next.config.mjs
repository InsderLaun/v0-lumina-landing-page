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
      // [fix C-1 landing-404] `/products` and `/tokenomics` were never real
      // routes (only the homepage anchor sections + the operate app exist), so
      // direct hits / typed URLs / external links 404'd (found in PR LP#174).
      // Point them at the canonical public content: `/products` -> the homepage
      // Products section (6 shields + live premiums, `id="products"`), and
      // `/tokenomics` -> the full whitepaper (its Tokenomics section). Temporary
      // (307) on purpose — these may graduate into dedicated pages later, so we
      // avoid browsers permanently caching the redirect.
      {
        source: "/products",
        destination: "/#products",
        permanent: false,
      },
      {
        source: "/tokenomics",
        destination: "/whitepaper",
        permanent: false,
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
