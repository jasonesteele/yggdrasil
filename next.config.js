// @ts-check
/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = withBundleAnalyzer({
  reactStrictMode: true,
  eslint: {
    dirs: ["src"],
  },
  experimental: {
    esmExternals: false,
  },
  webpack: (config) => {
    return config;
  },
});

module.exports = nextConfig;
