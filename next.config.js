/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  images: {
    domains: (process.env.IMAGE_DOMAINS ?? "").split(",")
  },
};

module.exports = nextConfig;
