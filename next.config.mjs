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
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  compiler,
};

export default nextConfig;
