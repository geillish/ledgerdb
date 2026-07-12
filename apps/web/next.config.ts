import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tilt/Caddy serves the app at :8080 while Next dev runs on :3000.
  allowedDevOrigins: ["localhost:8080", "127.0.0.1:8080"],
  experimental: {
    // Turbopack dev can enter an HMR/compile loop and consume unbounded RAM
    // (see vercel/next.js#91396). Keep these off if dev is run without --webpack.
    turbopackServerFastRefresh: false,
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;
