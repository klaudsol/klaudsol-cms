import AWS from "aws-sdk";
import { promisify } from "es6-promisify";
import crypto from "crypto";

const AWS_ACCESS_KEY_ID = process.env.AURORA_AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AURORA_AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AURORA_AWS_REGION;

const s3Config = {
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
};

export default getS3 = () => {
  const s3 = new AWS.S3(s3Config);

  return s3;
};

export const addObjectToBucket = async (obj) => {
  const s3 = getS3();
  const res = await s3.upload(obj).promise();

  return res;
};
