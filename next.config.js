/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  env: {
    AURORA_AWS_ACCESS_KEY_ID: process.env.AURORA_AWS_ACCESS_KEY_ID,
    AURORA_AWS_SECRET_ACCESS_KEY: process.env.AURORA_AWS_SECRET_ACCESS_KEY,
    CLOUDWATCH_AWS_DEFAULT_REGION: process.env.CLOUDWATCH_AWS_DEFAULT_REGION,
    CLOUDWATCH_AWS_LOG_GROUP_NAME: process.env.CLOUDWATCH_AWS_LOG_GROUP_NAME,
    CLOUDWATCH_AWS_LOG_STREAM_NAME: process.env.CLOUDWATCH_AWS_LOG_STREAM_NAME,
    AURORA_DATABASE: process.env.AURORA_DATABASE,
    AURORA_RESOURCE_ARN: process.env.AURORA_RESOURCE_ARN,
    AURORA_SECRET_ARN: process.env.AURORA_SECRET_ARN,
    SLACK_CHANNEL: process.env.SLACK_CHANNEL,
    SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
    SECRET_COOKIE_PASSWORD: process.env.SECRET_COOKIE_PASSWORD,
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    S3_AWS_ACCESS_KEY_ID_CERTIFICATE:
      process.env.S3_AWS_ACCESS_KEY_ID_CERTIFICATE,
    S3_AWS_SECRET_ACCESS_KEY_CERTIFICATE:
      process.env.S3_AWS_SECRET_ACCESS_KEY_CERTIFICATE,
  },
  images: {
    domains: [
      "sme-certificate-media.s3.amazonaws.com",
      "s3.console.aws.amazon.com",
    ],
  },
};

module.exports = nextConfig;
