import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-hosted on Beget instead of Vercel: standalone bundles only the
  // production node_modules the server actually needs into .next/standalone,
  // so the deploy doesn't have to ship or npm-install the full dependency
  // tree on the VPS.
  output: "standalone",
};

export default nextConfig;
