/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  env: {
    AURORA_AWS_ACCESS_KEY_ID: process.env.AURORA_AWS_ACCESS_KEY_ID,
    AURORA_AWS_SECRET_ACCESS_KEY: process.env.AURORA_AWS_SECRET_ACCESS_KEY,
    AURORA_DATABASE: process.env.AURORA_DATABASE,
    AURORA_RESOURCE_ARN: process.env.AURORA_RESOURCE_ARN,
    AURORA_SECRET_ARN: process.env.AURORA_SECRET_ARN,
    SECRET_COOKIE_PASSWORD: process.env.SECRET_COOKIE_PASSWORD,
    FRONTEND_URL: process.env.FRONTEND_URL,
  },
  images: {
    domains: (process.env.IMAGE_DOMAINS ?? "").split(","),
  },
};

module.exports = nextConfig;
