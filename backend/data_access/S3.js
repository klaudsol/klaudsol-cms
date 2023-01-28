import AWS from "aws-sdk";
import { promisify } from "es6-promisify";
import crypto from "crypto";

const AWS_ACCESS_KEY_ID = process.env.AURORA_AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AURORA_AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AURORA_AWS_REGION;
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;

const s3Config = {
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
};

export const initializeS3 = () => {
  const s3 = new AWS.S3(s3Config);

  return s3;
};

export const addImageToBucket = async ({ Key, Body, ContentType }) => {
  const s3 = initializeS3();

  const params = {
    Bucket: AWS_S3_BUCKET,
    Key,
    Body,
    ContentType,
    ACL: "public-read",
  };

  /* console.log(params); */
  const res = await s3.upload(params).promise();

  return res;
};
