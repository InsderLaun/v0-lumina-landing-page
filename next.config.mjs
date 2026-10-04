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
  async redirects() {
    return [
      { source: "/app/:path*", destination: "/", permanent: false },
      { source: "/connect", destination: "/", permanent: false },
      { source: "/faucet", destination: "/", permanent: false },
      { source: "/human/:path*", destination: "/", permanent: false },
      { source: "/agent/:path*", destination: "/", permanent: false },
      { source: "/legal", destination: "/", permanent: false },
      { source: "/terminos", destination: "/", permanent: false },
      { source: "/skills", destination: "/", permanent: false },
      { source: "/tutorial", destination: "/", permanent: false },
      { source: "/whitepaper/:path*", destination: "/", permanent: false },
      { source: "/whitepaper-short/:path*", destination: "/", permanent: false },
      { source: "/docs/:path*", destination: "/", permanent: false },
      { source: "/products", destination: "/", permanent: false },
      { source: "/tokenomics", destination: "/", permanent: false },
      { source: "/llms.txt", destination: "/", permanent: false },
      { source: "/llms-full.txt", destination: "/", permanent: false },
      { source: "/agent.md", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
