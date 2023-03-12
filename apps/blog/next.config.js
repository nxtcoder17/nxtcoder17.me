/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    transpilePackages: ["pkg"],
    appDir: true,
  },
};

module.exports = nextConfig;
