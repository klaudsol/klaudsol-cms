import aws from "aws-sdk";
import crypto from "crypto";
import { promisify } from "es6-promisify";

const randomBytes = promisify(crypto.randomBytes);

export const bucketName = "sme-certificate-media";

const S3_AWS_ACCESS_KEY_ID = process.env.S3_AWS_ACCESS_KEY_ID_CERTIFICATE;
const S3_AWS_SECRET_ACCESS_KEY =
  process.env.S3_AWS_SECRET_ACCESS_KEY_CERTIFICATE;

export const s3 = new aws.S3({
  region: "us-east-1",
  accessKeyId: S3_AWS_ACCESS_KEY_ID,
  secretAccessKey: S3_AWS_SECRET_ACCESS_KEY,
});

export async function generateImageName(ext) {
  const rawBytes = await randomBytes(16);
  return rawBytes.toString("hex") + "." + ext;
}
