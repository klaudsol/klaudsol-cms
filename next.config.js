/** @type {import('next').NextConfig} */
const domains = (process.env.KS_IMAGE_DOMAINS ?? "").split(",");

const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {protocol: 'https', hostname: 's3.amazonaws.com'},                      //file upload to AWS S3
      {protocol: 'https', hostname: '*.cloudfront.net'}                      
      //...domains.map(domain => ({protocol: 'https', hostname: domain}))       //user-defined image sources
    ]
  },
};

module.exports = nextConfig;
