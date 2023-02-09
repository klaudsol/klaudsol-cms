/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  images: {
    //TODO: Deprecate IMAGE_DOMAINS on v3.0.0 release
    domains: (process.env.KS_IMAGE_DOMAINS ?? process.env.IMAGE_DOMAINS ?? "").split(",")
  },
};

module.exports = nextConfig;
