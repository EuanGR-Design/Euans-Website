import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Plain HTML/CSS/JS in out/, so it can be hosted on GitHub Pages.
  output: "export",
  // /work/ and /work/console/ as folders with index.html, which every
  // static host serves correctly.
  trailingSlash: true,
  basePath,
  images: { loader: "custom", loaderFile: "./src/lib/imageLoader.ts" },
};

export default nextConfig;
