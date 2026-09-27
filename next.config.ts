import type { NextConfig } from "next";

// Files in public/ are served with max-age=0 by default, so every visit
// re-checks them. Fonts and the 3D library rarely change; media and models
// may, so they stay fresh for a day and are revalidated in the background.
const cache = (value: string) => [{ key: "Cache-Control", value }];

const nextConfig: NextConfig = {
  headers() {
    return [
      { source: "/fonts/:path*", headers: cache("public, max-age=31536000, immutable") },
      { source: "/vendor/:path*", headers: cache("public, max-age=2592000") },
      { source: "/:dir(hero|reel|img)/:path*", headers: cache("public, max-age=86400, stale-while-revalidate=604800") },
    ];
  },
};

export default nextConfig;
