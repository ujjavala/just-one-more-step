import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

export default function nextConfig(phase) {
  const staticMode = process.env.NEXT_PUBLIC_STATIC_MODE === "true";
  const pagesMode = process.env.NEXT_PUBLIC_GH_PAGES === "true";
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return {
    reactStrictMode: true,
    // Keep `next dev` output separate from `next build` output.
    // This avoids stale chunk lookups like './682.js' when switching modes.
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
    ...(staticMode ? { output: "export" } : {}),
    ...(pagesMode ? { basePath, assetPrefix: basePath } : {})
  };
}
