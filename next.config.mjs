/** @type {import('next').NextConfig} */
let compiler;
if (
  process.env.NEXT_PUBLIC_ENV === "dev" ||
  process.env.NEXT_PUBLIC_ENV === "mainnetio"
) {
  compiler = {};
} else {
  compiler = {
    removeConsole: {
      exclude: ["error"],
    },
  };
}

const isProxyEnabled =
  process.env.NEXT_PUBLIC_ENV === "mainnet" ||
  process.env.NEXT_PUBLIC_ENV === "mainnetio";

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  async rewrites() {
    if (!isProxyEnabled) return []; // 不启用代理时返回空

    return {
      fallback: [
        {
          source: "/api",
          destination:
            process.env.NEXT_PUBLIC_ENV === "mainnet"
              ? "https://agent-api.mindnetwork.xyz"
              : "https://agent-api.mindnetwork.io",
        },
      ],
    };
  },
  compiler,
};

export default nextConfig;
