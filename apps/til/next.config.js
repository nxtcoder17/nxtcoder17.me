/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['pkg'],
  experimental: {},
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
