/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  images: {
    domains: (process.env.KS_IMAGE_DOMAINS ?? "").split(","),
  },
};

module.exports = nextConfig;
