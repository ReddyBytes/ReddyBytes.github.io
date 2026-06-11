/**
 * Next.js 16 configuration.
 *
 * Static export to `out/` for GitHub Pages deployment.
 * - basePath empty (user-page repo `<username>.github.io` serves at root)
 * - trailingSlash: true so /about loads correctly on GitHub Pages
 *   (GH Pages rewrites /about to /about/index.html only with trailing slash)
 * - images.unoptimized: true (no Next image server in static export)
 *
 * See docs/DEPLOYMENT.md for the full GH Pages + HF Space pipeline.
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // No basePath — user-page repo serves at https://reddybytes.github.io/
};

export default nextConfig;
