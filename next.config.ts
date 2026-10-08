import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Plain HTML/CSS/JS in out/, so it can be hosted on GitHub Pages.
  output: "export",
  basePath,
  images: { loader: "custom", loaderFile: "./src/lib/imageLoader.ts" },
};

export default nextConfig;
